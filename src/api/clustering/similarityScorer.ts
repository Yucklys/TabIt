import type { DomainGroup } from './domainGrouper';
import { getDomainGroupSummary } from './domainGrouper';

/**
 * Similarity matrix storing pairwise similarity scores
 */
export type SimilarityMatrix = Map<string, Map<string, number>>;

/**
 * Create worker pool for parallel similarity scoring
 */
async function createWorkerPool(poolSize: number): Promise<Worker[]> {
  const workers: Worker[] = [];
  const workerUrl = chrome.runtime.getURL('similarityWorker.js');

  for (let i = 0; i < poolSize; i++) {
    const worker = new Worker(workerUrl);
    workers.push(worker);
  }

  // Wait a bit for workers to initialize
  await new Promise(resolve => setTimeout(resolve, 100));

  return workers;
}

/**
 * Score similarity using a worker
 */
function scoreWithWorker(
  worker: Worker,
  id: number,
  summary1: string,
  summary2: string
): Promise<number> {
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data.id === id) {
        worker.removeEventListener('message', handler);
        resolve(e.data.similarity);
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ id, summary1, summary2 });
  });
}

/**
 * Build similarity matrix for all domain group pairs using Web Workers
 * Matrix is symmetric: similarity(A,B) = similarity(B,A)
 */
export async function buildSimilarityMatrix(
  domainGroups: DomainGroup[]
): Promise<SimilarityMatrix> {
  const matrix: SimilarityMatrix = new Map();

  console.log(`Building similarity matrix for ${domainGroups.length} domain groups...`);

  // Initialize matrix
  for (const group of domainGroups) {
    matrix.set(group.domain, new Map());
  }

  // Collect all pairs that need to be compared
  type Pair = { group1: DomainGroup; group2: DomainGroup; summary1: string; summary2: string };
  const pairs: Pair[] = [];

  for (let i = 0; i < domainGroups.length; i++) {
    for (let j = i + 1; j < domainGroups.length; j++) {
      pairs.push({
        group1: domainGroups[i],
        group2: domainGroups[j],
        summary1: getDomainGroupSummary(domainGroups[i]),
        summary2: getDomainGroupSummary(domainGroups[j])
      });
    }
  }

  const totalComparisons = pairs.length;
  const workerPoolSize = 10;

  console.log(`Creating pool of ${workerPoolSize} Web Workers for parallel processing...`);
  const workers = await createWorkerPool(workerPoolSize);
  console.log(`Workers created, distributing ${totalComparisons} comparisons...`);

  // Track progress
  let completed = 0;
  const startTime = Date.now();

  // Distribute work across workers using Promise.all for true parallelism
  const results = await Promise.all(
    pairs.map(async (pair, index) => {
      // Assign to worker in round-robin fashion
      const workerIndex = index % workerPoolSize;
      const worker = workers[workerIndex];

      const similarity = await scoreWithWorker(
        worker,
        index,
        pair.summary1,
        pair.summary2
      );

      completed++;
      console.log(`[${completed}/${totalComparisons}] ${pair.group1.domain} <-> ${pair.group2.domain}: ${similarity.toFixed(2)}`);

      return { group1: pair.group1, group2: pair.group2, similarity };
    })
  );

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nCompleted all ${totalComparisons} comparisons in ${elapsedTime}s`);

  // Terminate workers
  workers.forEach(worker => worker.terminate());
  console.log('All workers terminated');

  // Populate matrix with results
  for (const { group1, group2, similarity } of results) {
    // Store in both directions (symmetric)
    matrix.get(group1.domain)!.set(group2.domain, similarity);
    matrix.get(group2.domain)!.set(group1.domain, similarity);
  }

  // Diagonal is 1.0 (perfect similarity with self)
  for (const group of domainGroups) {
    matrix.get(group.domain)!.set(group.domain, 1.0);
  }

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
