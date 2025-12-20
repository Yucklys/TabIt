import type { Cluster } from './hierarchicalClustering';
import type { TabProps } from '@/type/tabProps';

export type FilteredClusters = {
  validClusters: Cluster[];
  outlierTabs: TabProps[];
};

/**
 * Get total tab count for a cluster
 */
function getClusterTabCount(cluster: Cluster): number {
  return cluster.domainGroups.reduce((sum, group) => sum + group.tabs.length, 0);
}

/**
 * Get all tabs from a cluster
 */
function getClusterTabs(cluster: Cluster): TabProps[] {
  return cluster.domainGroups.flatMap(group => group.tabs);
}

/**
 * Filter clusters by minimum size constraint
 * @param clusters - Array of clusters from HAC
 * @param minSize - Minimum tabs per cluster (from tabRange[0])
 * @returns Valid clusters and outlier tabs that don't meet minimum size
 */
export function filterClustersBySize(
  clusters: Cluster[],
  minSize: number
): FilteredClusters {
  const validClusters: Cluster[] = [];
  const outlierTabs: TabProps[] = [];

  console.log(`Filtering clusters: min=${minSize}`);

  for (const cluster of clusters) {
    const tabCount = getClusterTabCount(cluster);

    if (tabCount < minSize) {
      console.log(`Cluster ${cluster.id}: ${tabCount} tabs < ${minSize} (too small, marking as outliers)`);
      outlierTabs.push(...getClusterTabs(cluster));
    } else {
      console.log(`Cluster ${cluster.id}: ${tabCount} tabs (valid)`);
      validClusters.push(cluster);
    }
  }

  console.log(`Filtering complete: ${validClusters.length} valid clusters, ${outlierTabs.length} outlier tabs`);

  for (const cluster of validClusters) {
    const domains = cluster.domainGroups.map((domainGroup) => domainGroup.domain).join(", ");
    console.log(`Cluster ${cluster.id}: ${domains}`);
  }

  return { validClusters, outlierTabs };
}
