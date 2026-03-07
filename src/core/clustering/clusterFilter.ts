import type { Community } from './leiden';

export type FilteredCommunities = {
  validCommunities: Community[];
  outlierTabIndices: number[];
};

/**
 * Filter communities by minimum size constraint.
 * @param communities - Array of communities (each an array of tab indices)
 * @param minSize - Minimum tabs per community (from tabRange[0])
 * @returns Valid communities and outlier tab indices that don't meet minimum size
 */
export function filterCommunitiesBySize(
  communities: Community[],
  minSize: number
): FilteredCommunities {
  const validCommunities: Community[] = [];
  const outlierTabIndices: number[] = [];

  console.log(`Filtering communities: min=${minSize}`);

  for (let i = 0; i < communities.length; i++) {
    const community = communities[i];
    if (community.length < minSize) {
      console.log(`Community ${i}: ${community.length} tabs < ${minSize} (too small, marking as outliers)`);
      outlierTabIndices.push(...community);
    } else {
      console.log(`Community ${i}: ${community.length} tabs (valid)`);
      validCommunities.push(community);
    }
  }

  console.log(`Filtering complete: ${validCommunities.length} valid communities, ${outlierTabIndices.length} outlier tabs`);

  return { validCommunities, outlierTabIndices };
}
