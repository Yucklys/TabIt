import type { TabProps } from '$type/tabProps';
import type { DomainGroup } from './domainGrouper';

// --- Types ---

export type SimilarityMatrix = Map<string, Map<string, number>>;

export interface SimilarityConfig {
  textWeight: number;    // weight for TF-IDF cosine similarity (default 0.7)
  domainWeight: number;  // weight for same-domain bonus (default 0.3)
}

export interface TabSimilarityScorer {
  similarity(i: number, j: number): number;
  kNearest(i: number, k: number): Array<{ index: number; score: number }>;
  buildMatrix(): Float64Array;
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

  return {
    similarity,
    kNearest,
    buildMatrix,
    get size() { return n; },
  };
}

// --- Adapter for HAC backward compatibility ---

/**
 * Convert a per-tab TF-IDF scorer into a domain-group SimilarityMatrix
 * compatible with the existing HAC pipeline.
 *
 * For each pair of domain groups, computes average pairwise similarity
 * between all tabs in the two groups.
 */
export function buildDomainGroupMatrix(
  tabs: TabProps[],
  domainGroups: DomainGroup[],
  scorer: TabSimilarityScorer
): SimilarityMatrix {
  // Build tab index lookup: tabId → index in tabs array
  const tabIndexMap = new Map<number, number>();
  for (let i = 0; i < tabs.length; i++) {
    tabIndexMap.set(tabs[i].id, i);
  }

  const matrix: SimilarityMatrix = new Map();

  // Initialize
  for (const group of domainGroups) {
    matrix.set(group.domain, new Map());
  }

  for (let i = 0; i < domainGroups.length; i++) {
    const g1 = domainGroups[i];
    // Self-similarity
    matrix.get(g1.domain)!.set(g1.domain, 1.0);

    for (let j = i + 1; j < domainGroups.length; j++) {
      const g2 = domainGroups[j];

      // Average pairwise similarity between all tabs in the two groups
      let totalSim = 0;
      let count = 0;

      for (const t1 of g1.tabs) {
        const idx1 = tabIndexMap.get(t1.id);
        if (idx1 === undefined) continue;

        for (const t2 of g2.tabs) {
          const idx2 = tabIndexMap.get(t2.id);
          if (idx2 === undefined) continue;

          totalSim += scorer.similarity(idx1, idx2);
          count++;
        }
      }

      const avgSim = count > 0 ? totalSim / count : 0;
      matrix.get(g1.domain)!.set(g2.domain, avgSim);
      matrix.get(g2.domain)!.set(g1.domain, avgSim);
    }
  }

  return matrix;
}

/**
 * Get similarity score between two domains from matrix.
 */
export function getSimilarity(
  matrix: SimilarityMatrix,
  domain1: string,
  domain2: string
): number {
  return matrix.get(domain1)?.get(domain2) ?? 0.0;
}
