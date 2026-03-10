import type { Community } from './leiden';

export type FilteredCommunities = {
  validCommunities: Community[];
  outlierTabIndices: number[];
};

/**
 * Filter communities by minimum size constraint.
 * @param communities - Array of communities (each an array of tab indices)
 * @param minSize - Minimum tabs per community (from tabRange[0])
 * @param maxSize - Maximum tabs per community (from tabRange[1])
 * @returns Valid communities and outlier tab indices that don't meet minimum size
 */
export function filterCommunitiesBySize(
  communities: Community[],
  minSize: number,
  maxSize?: number
): FilteredCommunities {
  const validCommunities: Community[] = [];
  const outlierTabIndices: number[] = [];

  for (const community of communities) {
    if (community.length < minSize || (maxSize && community.length > maxSize)) {
      outlierTabIndices.push(...community);
    } else {
      validCommunities.push(community);
    }
  }

  return { validCommunities, outlierTabIndices };
}
