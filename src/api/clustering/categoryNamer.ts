import type { Cluster } from './hierarchicalClustering';
import { getDomainGroupSummary } from './domainGrouper';

const namingSchema = {
  "type": "object",
  "properties": {
    "categoryName": {
      "type": "string"
    }
  },
  "required": ["categoryName"]
};

const matchingSchema = {
  "type": "object",
  "properties": {
    "bestMatch": {
      "type": "string"
    },
    "confidence": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0
    }
  },
  "required": ["bestMatch", "confidence"]
};

/**
 * Initialize AI session for category naming
 */
async function initNamingSession() {
  return await LanguageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: `You are a category naming assistant. Generate concise 1-2 word names for browser tab groups.

Guidelines:
- Keep names short and descriptive
- Use title case (e.g., "Web Dev", "Documentation")
- Focus on the common purpose or topic
- Avoid generic names like "General" or "Misc"`
      }
    ]
  });
}

/**
 * Initialize AI session for category matching
 */
async function initMatchingSession() {
  return await LanguageModel.create({
    initialPrompts: [
      {
        role: "system",
        content: `You are a category matching assistant. Match browser tab groups to predefined category names.

Return:
- bestMatch: The closest predefined category name
- confidence: How well the tabs match (0.0-1.0)`
      }
    ],
    expectedOutputs: [{ "type": "text", "languages": ["en"] }]
  });
}

/**
 * Generate a category name from cluster content using AI
 */
async function generateCategoryName(cluster: Cluster): Promise<string> {
  const summaries = cluster.domainGroups.map(group => getDomainGroupSummary(group));

  const promptText = `Generate a concise 1-2 word category name for this group of browser tabs:

${summaries.join('\n\n')}

What is a good category name that captures the common theme or purpose?`;

  try {
    const session = await initNamingSession();
    const response = await session.prompt(promptText, {
      responseConstraint: namingSchema
    });

    const parsed = JSON.parse(response);
    return parsed.categoryName || 'General';
  } catch (error) {
    console.error('Error generating category name:', error);
    // Fallback: use most common domain
    return cluster.domainGroups[0]?.domain || 'General';
  }
}

/**
 * Match cluster to closest custom category name
 * @param cluster - The cluster to match
 * @param customGroups - Available custom category names
 * @param threshold - Minimum confidence required (default 0.6)
 * @returns Match result if confidence >= threshold, null otherwise
 */
async function matchToCustomCategory(
  cluster: Cluster,
  customGroups: string[],
  threshold: number = 0.5
): Promise<{ name: string; confidence: number } | null> {
  if (!customGroups || !Array.isArray(customGroups) || customGroups.length === 0) {
    return null;
  }

  const summaries = cluster.domainGroups.map(group => getDomainGroupSummary(group));

  const promptText = `Match this group of browser tabs to the closest predefined category:

Tabs:
${summaries.join('\n\n')}

Predefined categories: ${customGroups.join(', ')}

Which category best matches these tabs, and how confident are you (0.0-1.0)?`;

  try {
    const session = await initMatchingSession();
    const response = await session.prompt(promptText, {
      responseConstraint: matchingSchema
    });

    const parsed = JSON.parse(response);
    const match = {
      name: parsed.bestMatch,
      confidence: parsed.confidence
    };

    // Return match only if it meets the threshold
    if (match.confidence >= threshold) {
      return match;
    } else {
      console.log(`Match confidence ${match.confidence.toFixed(2)} below threshold ${threshold}`);
      return null;
    }
  } catch (error) {
    console.error('Error matching custom category:', error);
    return null;
  }
}

/**
 * Name a cluster based on custom groups setting
 * @param cluster - The cluster to name
 * @param customGroups - Optional array of custom category names
 * @param matchThreshold - Minimum confidence to use custom category match (default 0.6)
 */
export async function nameCluster(
  cluster: Cluster,
  customGroups: string[] = [],
  matchThreshold: number = 0.6
): Promise<string> {
  if (customGroups.length === 0) {
    // No custom groups: generate name from content
    const name = await generateCategoryName(cluster);
    console.log(`Generated name for cluster ${cluster.id}: "${name}"`);
    return name;
  } else {
    // Custom groups exist: try to match
    const match = await matchToCustomCategory(cluster, customGroups, matchThreshold);

    if (match) {
      console.log(`Matched cluster ${cluster.id} to "${match.name}" (confidence: ${match.confidence.toFixed(2)})`);
      return match.name;
    } else {
      // No good match: generate new name
      const name = await generateCategoryName(cluster);
      console.log(`Cluster ${cluster.id} no good match, generated: "${name}"`);
      return name;
    }
  }
}

/**
 * Get total tab count for a cluster
 */
function getClusterTabCount(cluster: Cluster): number {
  return cluster.domainGroups.reduce((sum, group) => sum + group.tabs.length, 0);
}

/**
 * Generate an alternative category name, excluding already-used names
 */
async function generateAlternativeName(
  cluster: Cluster,
  excludedNames: string[]
): Promise<string> {
  const summaries = cluster.domainGroups.map(group => getDomainGroupSummary(group));

  const promptText = `Generate a concise 1-2 word category name for this group of browser tabs.

${summaries.join('\n\n')}

IMPORTANT: Do NOT use any of these names (they are already taken):
${excludedNames.join(', ')}

What is a good category name that captures the common theme or purpose?`;

  try {
    const session = await initNamingSession();
    const response = await session.prompt(promptText, {
      responseConstraint: namingSchema
    });

    const parsed = JSON.parse(response);
    return parsed.categoryName || 'General';
  } catch (error) {
    console.error('Error generating alternative name:', error);
    // Fallback: use domain with number suffix to avoid collision
    const baseName = cluster.domainGroups[0]?.domain || 'General';
    let suffix = 1;
    let name = baseName;
    while (excludedNames.includes(name)) {
      suffix++;
      name = `${baseName} ${suffix}`;
    }
    return name;
  }
}

/**
 * Name all clusters with confidence-based assignment and group size enforcement
 * @param clusters - Clusters to name
 * @param customGroups - Optional custom category names
 * @param maxSize - Maximum tabs per group
 */
export async function nameClusters(
  clusters: Cluster[],
  customGroups: string[] = [],
  maxSize: number = Infinity
): Promise<Map<Cluster, string>> {
  type ClusterMatch = {
    cluster: Cluster;
    name: string;
    confidence: number;
  };

  // Step 1: Get initial names and confidences for all clusters
  const clusterMatches: ClusterMatch[] = [];

  for (const cluster of clusters) {
    if (customGroups.length === 0) {
      // No custom groups: generate name from content
      const name = await generateCategoryName(cluster);
      clusterMatches.push({ cluster, name, confidence: 1.0 });
      console.log(`Generated name for cluster ${cluster.id}: "${name}"`);
    } else {
      // Custom groups exist: match to them
      const match = await matchToCustomCategory(cluster, customGroups);
      if (match) {
        clusterMatches.push({ cluster, name: match.name, confidence: match.confidence });
        console.log(`Matched cluster ${cluster.id} to "${match.name}" (confidence: ${match.confidence.toFixed(2)})`);
      } else {
        // No match met threshold, generate name
        const name = await generateCategoryName(cluster);
        clusterMatches.push({ cluster, name, confidence: 0.0 });
        console.log(`No match for cluster ${cluster.id}, generated: "${name}"`);
      }
    }
  }

  // Step 2: Sort by combined score (confidence * tab count)
  clusterMatches.sort((a, b) => {
    const aTabCount = getClusterTabCount(a.cluster);
    const bTabCount = getClusterTabCount(b.cluster);
    const aScore = a.confidence * aTabCount;
    const bScore = b.confidence * bTabCount;
    return bScore - aScore; // Higher score first
  });
  console.log('\nAssigning clusters by combined score (confidence × tab count)...');

  // Step 3: Assign to groups, trying remaining custom categories if size exceeded
  const result = new Map<Cluster, string>();
  const groupSizes = new Map<string, number>();

  // Safely copy customGroups in case it's not an iterable array
  const availableCustomGroups: string[] = [];
  if (Array.isArray(customGroups)) {
    for (let i = 0; i < customGroups.length; i++) {
      availableCustomGroups.push(customGroups[i]);
    }
  }

  for (let i = 0; i < clusterMatches.length; i++) {
    const match = clusterMatches[i];
    const tabCount = getClusterTabCount(match.cluster);
    let finalName = match.name;

    // Check if adding to this group would exceed maxSize
    const currentSize = groupSizes.get(finalName) || 0;
    if (currentSize > maxSize) {
      console.log(`Group "${finalName}" would exceed max size (${currentSize} + ${tabCount} > ${maxSize})`);

      // Try to match to remaining available custom categories first
      const fallbackMatch = await matchToCustomCategory(match.cluster, availableCustomGroups);

      if (fallbackMatch) {
        finalName = fallbackMatch.name;
        console.log(`Matched to fallback category "${finalName}" (confidence: ${fallbackMatch.confidence.toFixed(2)})`);
      } else {
        // No good match in remaining categories, generate alternative name
        console.log('No match in remaining custom categories, generating alternative name...');

        // Safely extract Map keys without using iterators
        const usedNames: string[] = [];
        groupSizes.forEach((value, key) => usedNames.push(key));

        finalName = await generateAlternativeName(match.cluster, usedNames);
        console.log(`Generated alternative name: "${finalName}"`);
      }
    }

    result.set(match.cluster, finalName);
    const newSize = (groupSizes.get(finalName) || 0) + tabCount;
    groupSizes.set(finalName, newSize);
    console.log(`Assigned cluster ${match.cluster.id} (${tabCount} tabs) to "${finalName}" (group now has ${newSize} tabs)`);

    // Remove category from available list if it's now full
    if (newSize >= maxSize) {
      const index = availableCustomGroups.indexOf(finalName);
      if (index !== -1) {
        availableCustomGroups.splice(index, 1);
        console.log(`Category "${finalName}" is now full, removed from available list`);
      }
    }
  }

  return result;
}
