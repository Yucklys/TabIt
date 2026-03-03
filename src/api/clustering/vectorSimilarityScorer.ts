import type { DomainGroup } from './domainGrouper';
import { getDomainGroupSummary } from './domainGrouper';
import { pipeline, env } from '@huggingface/transformers';

export type SimilarityMatrix = Map<string, Map<string, number>>;

// Inline fallback for environments without Worker (e.g. MV3 service worker)
let inlinePipeline: any = null;

async function initInlinePipeline(): Promise<any> {
    if (inlinePipeline) return inlinePipeline;
    env.allowLocalModels = false;
    if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.numThreads = 1;
        const extensionRoot = new URL('/', self.location.href).href;
        env.backends.onnx.wasm.wasmPaths = extensionRoot + 'assets/';
    }
    inlinePipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        device: 'wasm',
        dtype: 'fp32',
    });
    return inlinePipeline;
}

async function getEmbeddingInline(text: string): Promise<number[]> {
    const extractor = await initInlinePipeline();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
}

/**
 * Initialize Web Worker pool for embedding extraction
 */
async function createWorkerPool(poolSize: number): Promise<Worker[]> {
    const workers: Worker[] = [];
    const workerUrl = chrome.runtime.getURL('embeddingWorker-v2.js');

    for (let i = 0; i < poolSize; i++) {
        // MUST specify type: 'module' because Transformers.js uses import.meta
        const worker = new Worker(workerUrl, { type: 'module' });
        workers.push(worker);
    }

    // Wait for workers to spin up
    await new Promise(resolve => setTimeout(resolve, 100));
    return workers;
}

/**
 * Get embedding vector for a piece of text using a specific worker
 */
function getEmbeddingWithWorker(
    worker: Worker,
    id: number,
    text: string
): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const handler = (e: MessageEvent) => {
            // Ignore progress updates
            if (e.data.status === 'progress') return;

            if (e.data.id === id) {
                worker.removeEventListener('message', handler);
                if (e.data.status === 'complete') {
                    resolve(e.data.embedding);
                } else {
                    reject(new Error(e.data.error));
                }
            }
        };

        worker.addEventListener('message', handler);
        worker.postMessage({ id, text });
    });
}

/**
 * Fast cosine similarity between two normalized vectors
 * Since we use normalize: true in the worker, we just need the dot product
 */
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct)); // Clamp to [0, 1]
}

/**
 * Build similarity matrix using Transformers.js vector embeddings
 */
export async function buildSimilarityMatrix(
    domainGroups: DomainGroup[]
): Promise<SimilarityMatrix> {
    const matrix: SimilarityMatrix = new Map();
    const startTime = Date.now();

    console.log(`Building Semantic Vector similarity matrix for ${domainGroups.length} domain groups...`);

    // 1. Initialize Matrix structure mapping
    for (const group of domainGroups) {
        matrix.set(group.domain, new Map());
        matrix.get(group.domain)!.set(group.domain, 1.0); // self-similarity
    }

    // 2. Compute embeddings for each unique Domain Group
    const canUseWorkers = typeof Worker !== 'undefined';
    const embeddingsMap: Map<string, number[]> = new Map();
    let completedExtractions = 0;

    console.log(`Extracting vectors for ${domainGroups.length} domains (${canUseWorkers ? 'Worker' : 'inline'} mode)...`);

    if (canUseWorkers) {
        // Worker pool path for popup/foreground contexts
        const workerPoolSize = 1;
        console.log(`Creating pool of ${workerPoolSize} Web Workers for embedding extraction...`);
        const workers = await createWorkerPool(workerPoolSize);

        await Promise.all(
            domainGroups.map(async (group, index) => {
                const summary = getDomainGroupSummary(group);
                const worker = workers[index % workerPoolSize];

                try {
                    const vector = await getEmbeddingWithWorker(worker, index, summary);
                    embeddingsMap.set(group.domain, vector);
                    completedExtractions++;
                    console.log(`[${completedExtractions}/${domainGroups.length}] Extracted vector for ${group.domain}`);
                } catch (e) {
                    console.error(`Failed to extract vector for ${group.domain}:`, e);
                    embeddingsMap.set(group.domain, []);
                }
            })
        );

        workers.forEach(w => w.terminate());
        console.log('All embeddings extracted, workers terminated.');
    } else {
        // Inline fallback for service worker context (no Worker constructor)
        for (const group of domainGroups) {
            const summary = getDomainGroupSummary(group);
            try {
                const vector = await getEmbeddingInline(summary);
                embeddingsMap.set(group.domain, vector);
                completedExtractions++;
                console.log(`[${completedExtractions}/${domainGroups.length}] Extracted vector for ${group.domain}`);
            } catch (e) {
                console.error(`Failed to extract vector for ${group.domain}:`, e);
                embeddingsMap.set(group.domain, []);
            }
        }
        console.log('All embeddings extracted (inline mode).');
    }

    // 3. Compute Pairwise Cosine Similarity Locally (O(N^2) but it's just raw math)
    let mathComparisons = 0;
    for (let i = 0; i < domainGroups.length; i++) {
        for (let j = i + 1; j < domainGroups.length; j++) {
            const g1 = domainGroups[i].domain;
            const g2 = domainGroups[j].domain;

            const v1 = embeddingsMap.get(g1) || [];
            const v2 = embeddingsMap.get(g2) || [];

            const similarity = calculateCosineSimilarity(v1, v2);

            // Store in matrix
            matrix.get(g1)!.set(g2, similarity);
            matrix.get(g2)!.set(g1, similarity);

            mathComparisons++;
        }
    }

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nCompleted ${domainGroups.length} vector extractions and ${mathComparisons} math comparisons in ${elapsedTime}s`);

    return matrix;
}

/**
 * Get similarity score between two domains from matrix
 */
export function getSimilarity(
    matrix: SimilarityMatrix,
    domain1: string,
    domain2: string
): number {
    return matrix.get(domain1)?.get(domain2) ?? 0.0;
}
