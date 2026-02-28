import type { DomainGroup } from './domainGrouper';
import { getDomainGroupSummary } from './domainGrouper';

export type SimilarityMatrix = Map<string, Map<string, number>>;

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
    // We strictly use 1 worker because instantiating multiple WASM models destroys memory and CPU
    const workerPoolSize = 1;
    console.log(`Creating pool of ${workerPoolSize} Web Workers for embedding extraction...`);
    const workers = await createWorkerPool(workerPoolSize);

    const embeddingsMap: Map<string, number[]> = new Map();
    let completedExtractions = 0;

    console.log(`Extracting vectors for ${domainGroups.length} domains...`);

    // Extract embeddings in parallel
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
                // Fallback to empty vector if extraction fails
                embeddingsMap.set(group.domain, []);
            }
        })
    );

    // Terminate workers since extraction is complete
    workers.forEach(w => w.terminate());
    console.log('All embeddings extracted, workers terminated.');

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
