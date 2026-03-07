import type { TabProps } from '$type/tabProps';
import type { Community } from './leiden';

// --- Types ---

export interface SimilarityConfig {
  textWeight: number;    // weight for TF-IDF cosine similarity (default 0.7)
  domainWeight: number;  // weight for same-domain bonus (default 0.3)
}

export interface TabSimilarityScorer {
  similarity(i: number, j: number): number;
  kNearest(i: number, k: number): Array<{ index: number; score: number }>;
  buildMatrix(): Float64Array;
  clusterKeywords(tabIndices: number[], topN: number): string[];
  readonly size: number;
}

// --- Stop Words ---

const STOP_WORDS = new Set([
  // English common
  'the', 'be', 'to', 'of', 'and', 'in', 'that', 'have', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but',
  'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an',
  'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  // Web noise
  'http', 'https', 'www', 'com', 'org', 'net', 'io', 'html', 'htm',
  'index', 'page', 'en', 'us', 'new', 'web', 'app', 'site',
]);

// --- Tokenization ---

/**
 * Tokenize a tab's text content (title + path) into normalized terms.
 * - Splits camelCase
 * - Lowercases
 * - Removes short tokens (< 2 chars)
 * - Removes stop words
 */
export function tokenize(text: string): string[] {
  // Split camelCase: "getStarted" → "get Started"
  const camelSplit = text.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Lowercase and split on non-alphanumeric
  const raw = camelSplit.toLowerCase().split(/[^a-z0-9]+/);

  // Filter short tokens and stop words
  return raw.filter(t => t.length >= 2 && !STOP_WORDS.has(t));
}

// --- TF-IDF Engine ---

type SparseVector = Map<string, number>;

/**
 * Build TF-IDF vectors for a set of documents.
 * Each document is a token list derived from a tab's title + path.
 */
function buildTfidfVectors(documents: string[][]): SparseVector[] {
  const n = documents.length;

  // Document frequency: how many documents contain each term
  const df = new Map<string, number>();
  for (const doc of documents) {
    const seen = new Set(doc);
    for (const term of seen) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }

  // Build TF-IDF vector for each document
  const vectors: SparseVector[] = [];
  for (const doc of documents) {
    const vec: SparseVector = new Map();
    if (doc.length === 0) {
      vectors.push(vec);
      continue;
    }

    // Term frequency
    const tf = new Map<string, number>();
    for (const term of doc) {
      tf.set(term, (tf.get(term) ?? 0) + 1);
    }

    // TF-IDF
    for (const [term, count] of tf) {
      const termTf = count / doc.length;
      const termIdf = Math.log(n / (1 + (df.get(term) ?? 0)));
      vec.set(term, termTf * termIdf);
    }

    vectors.push(vec);
  }

  return vectors;
}

/**
 * Sparse cosine similarity between two vectors.
 * Iterates the smaller map and looks up in the larger for efficiency.
 */
function sparseCosine(a: SparseVector, b: SparseVector): number {
  if (a.size === 0 || b.size === 0) return 0;

  // Ensure we iterate the smaller map
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];

  let dot = 0;
  for (const [term, valA] of small) {
    const valB = large.get(term);
    if (valB !== undefined) {
      dot += valA * valB;
    }
  }

  if (dot === 0) return 0;

  // Compute magnitudes
  let magA = 0;
  for (const val of a.values()) magA += val * val;

  let magB = 0;
  for (const val of b.values()) magB += val * val;

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// --- Public API ---

const DEFAULT_CONFIG: SimilarityConfig = {
  textWeight: 0.7,
  domainWeight: 0.3,
};

/**
 * Build a similarity scorer for a set of tabs.
 * Uses TF-IDF cosine similarity on title+path tokens with a same-domain bonus.
 *
 * sim(A, B) = textWeight * cosine(tfidf(A), tfidf(B)) + domainWeight * sameDomain(A, B)
 */
export function buildSimilarityScorer(
  tabs: TabProps[],
  config?: Partial<SimilarityConfig>
): TabSimilarityScorer {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const n = tabs.length;

  // Tokenize each tab: title + path (domain excluded — handled by bonus)
  const documents = tabs.map(tab => tokenize(tab.title + ' ' + tab.path));

  // Build TF-IDF vectors
  const vectors = buildTfidfVectors(documents);

  // Extract domains for bonus calculation
  const domains = tabs.map(tab => tab.domain);

  function similarity(i: number, j: number): number {
    if (i === j) return 1;
    const textSim = sparseCosine(vectors[i], vectors[j]);
    const domainBonus = domains[i] === domains[j] ? 1 : 0;
    return cfg.textWeight * textSim + cfg.domainWeight * domainBonus;
  }

  function kNearest(i: number, k: number): Array<{ index: number; score: number }> {
    const scores: Array<{ index: number; score: number }> = [];
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      scores.push({ index: j, score: similarity(i, j) });
    }
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, k);
  }

  function buildMatrix(): Float64Array {
    const mat = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      mat[i * n + i] = 1;
      for (let j = i + 1; j < n; j++) {
        const s = similarity(i, j);
        mat[i * n + j] = s;
        mat[j * n + i] = s;
      }
    }
    return mat;
  }

  function clusterKeywords(tabIndices: number[], topN: number): string[] {
    // Sum TF-IDF vectors for all tabs in the cluster
    const combined: SparseVector = new Map();
    for (const idx of tabIndices) {
      const vec = vectors[idx];
      if (!vec) continue;
      for (const [term, score] of vec) {
        combined.set(term, (combined.get(term) ?? 0) + score);
      }
    }

    // Sort by aggregated score descending, return top N terms
    return Array.from(combined.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([term]) => term);
  }

  return {
    similarity,
    kNearest,
    buildMatrix,
    clusterKeywords,
    get size() { return n; },
  };
}

// --- Cluster Naming ---

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Name communities using TF-IDF keyword extraction.
 * For each community (array of tab indices), picks the top keyword.
 * Handles collisions by falling back to the next keyword.
 * Falls back to the most common domain if no keywords are available.
 */
export function nameCommunities(
  communities: Community[],
  tabs: TabProps[],
  scorer: TabSimilarityScorer
): string[] {
  const result: string[] = [];
  const usedNames = new Set<string>();

  for (const community of communities) {
    // Get top keywords for the community
    const keywords = scorer.clusterKeywords(community, 5);

    // Pick first unused keyword
    let name: string | null = null;
    for (const kw of keywords) {
      const titled = toTitleCase(kw);
      if (!usedNames.has(titled)) {
        name = titled;
        break;
      }
    }

    // Fallback: most common domain
    if (!name) {
      const domainCounts = new Map<string, number>();
      for (const idx of community) {
        const domain = tabs[idx]?.domain ?? 'unknown';
        domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
      }
      let bestDomain = 'Group';
      let bestCount = 0;
      for (const [domain, count] of domainCounts) {
        if (count > bestCount) {
          bestDomain = domain;
          bestCount = count;
        }
      }
      name = toTitleCase(bestDomain);
      // If still collides, append a number
      if (usedNames.has(name)) {
        let suffix = 2;
        while (usedNames.has(`${name} ${suffix}`)) suffix++;
        name = `${name} ${suffix}`;
      }
    }

    usedNames.add(name);
    result.push(name);
  }

  return result;
}
