import type { DomainGroup } from './domainGrouper';
import type { SimilarityMatrix } from './similarityScorer';
import { getSimilarity } from './similarityScorer';

/**
 * Cluster - a group of domain groups that have been merged together
 */
export type Cluster = {
  domainGroups: DomainGroup[];
  id: number;
};

/**
 * Calculate average linkage similarity between two clusters
 * Average of all pairwise similarities between domain groups in the clusters
 */
function calculateAverageLinkage(
  cluster1: Cluster,
  cluster2: Cluster,
  matrix: SimilarityMatrix
): number {
  let totalSimilarity = 0;
  let count = 0;

  for (const group1 of cluster1.domainGroups) {
    for (const group2 of cluster2.domainGroups) {
      totalSimilarity += getSimilarity(matrix, group1.domain, group2.domain);
      count++;
    }
  }

  return count > 0 ? totalSimilarity / count : 0.0;
}

/**
 * Find the pair of clusters with highest similarity
 */
function findMostSimilarPair(
  clusters: Cluster[],
  matrix: SimilarityMatrix
): { index1: number; index2: number; similarity: number } | null {
  let maxSimilarity = -1;
  let bestPair: { index1: number; index2: number; similarity: number } | null = null;

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const similarity = calculateAverageLinkage(clusters[i], clusters[j], matrix);

      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestPair = { index1: i, index2: j, similarity };
      }
    }
  }

  return bestPair;
}

/**
 * Hierarchical Agglomerative Clustering with average linkage
 * @param domainGroups - Array of domain groups to cluster
 * @param matrix - Pairwise similarity matrix
 * @param threshold - Minimum similarity to merge clusters (default 0.5)
 * @returns Array of clusters
 */
export function hierarchicalClustering(
  domainGroups: DomainGroup[],
  matrix: SimilarityMatrix,
  threshold: number = 0.5
): Cluster[] {
  console.log(`Starting HAC with ${domainGroups.length} domain groups, threshold: ${threshold}`);

  // Initialize: each domain group is its own cluster
  const clusters: Cluster[] = domainGroups.map((group, index) => ({
    domainGroups: [group],
    id: index
  }));

  let iteration = 0;

  while (true) {
    // Find most similar pair
    const pair = findMostSimilarPair(clusters, matrix);

    if (!pair || pair.similarity < threshold) {
      console.log(`Stopping HAC: ${pair ? `max similarity ${pair.similarity.toFixed(2)} < threshold ${threshold}` : 'no pairs left'}`);
      break;
    }

    iteration++;
    console.log(`[Iteration ${iteration}] Merging clusters ${pair.index1} and ${pair.index2} (similarity: ${pair.similarity.toFixed(2)})`);

    // Merge the two clusters
    const merged: Cluster = {
      domainGroups: [
        ...clusters[pair.index1].domainGroups,
        ...clusters[pair.index2].domainGroups
      ],
      id: Math.min(clusters[pair.index1].id, clusters[pair.index2].id)
    };

    // Remove the two old clusters and add merged one
    const newClusters = clusters.filter((_, i) => i !== pair.index1 && i !== pair.index2);
    newClusters.push(merged);

    clusters.length = 0;
    clusters.push(...newClusters);
  }

  console.log(`HAC complete: ${clusters.length} final clusters`);
  return clusters;
}
