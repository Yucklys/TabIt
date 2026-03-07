import { test, expect, describe } from 'bun:test';
import { tokenize, buildSimilarityScorer, buildDomainGroupMatrix, getSimilarity, nameClusters } from './tfidfSimilarity';
import type { TabProps } from '$type/tabProps';
import type { DomainGroup } from './domainGrouper';
import type { Cluster } from './hierarchicalClustering';

// --- Tokenization ---

describe('tokenize', () => {
  test('splits camelCase', () => {
    const tokens = tokenize('helloWorldTest');
    expect(tokens).toContain('hello');
    expect(tokens).toContain('world');
    expect(tokens).toContain('test');
  });

  test('lowercases all tokens', () => {
    const tokens = tokenize('Hello WORLD');
    expect(tokens).toContain('hello');
    expect(tokens).toContain('world');
  });

  test('removes tokens shorter than 2 chars', () => {
    const tokens = tokenize('I am a test');
    expect(tokens).not.toContain('i');
    expect(tokens).not.toContain('a');
    expect(tokens).toContain('am');
    expect(tokens).toContain('test');
  });

  test('removes stop words', () => {
    const tokens = tokenize('the quick fox and the lazy dog');
    expect(tokens).not.toContain('the');
    expect(tokens).not.toContain('and');
    expect(tokens).toContain('quick');
    expect(tokens).toContain('fox');
    expect(tokens).toContain('lazy');
    expect(tokens).toContain('dog');
  });

  test('removes web noise', () => {
    const tokens = tokenize('http www com html index page');
    expect(tokens).toHaveLength(0);
  });

  test('splits on non-alphanumeric', () => {
    const tokens = tokenize('foo/bar-baz_qux');
    expect(tokens).toContain('foo');
    expect(tokens).toContain('bar');
    expect(tokens).toContain('baz');
    expect(tokens).toContain('qux');
  });

  test('handles empty input', () => {
    expect(tokenize('')).toHaveLength(0);
  });
});

// --- Similarity Scorer ---

function makeTabs(specs: Array<{ title: string; domain: string; path: string }>): TabProps[] {
  return specs.map((s, i) => ({ id: i + 1, title: s.title, domain: s.domain, path: s.path }));
}

describe('buildSimilarityScorer', () => {
  const tabs = makeTabs([
    { title: 'React Documentation', domain: 'react.dev', path: '/docs/getting-started' },
    { title: 'React Hooks Reference', domain: 'react.dev', path: '/docs/hooks' },
    { title: 'TypeScript Handbook', domain: 'typescriptlang.org', path: '/docs/handbook' },
    { title: 'Buy Running Shoes', domain: 'amazon.com', path: '/shoes/running' },
    { title: 'Best Running Shoes 2024', domain: 'runnersworld.com', path: '/gear/shoes' },
  ]);

  const scorer = buildSimilarityScorer(tabs);

  test('self-similarity is 1', () => {
    expect(scorer.similarity(0, 0)).toBe(1);
    expect(scorer.similarity(3, 3)).toBe(1);
  });

  test('same-domain tabs have higher similarity', () => {
    // React tabs (same domain) should be more similar than React vs Amazon
    const reactPair = scorer.similarity(0, 1);
    const reactVsAmazon = scorer.similarity(0, 3);
    expect(reactPair).toBeGreaterThan(reactVsAmazon);
  });

  test('topically similar tabs from different domains score higher than unrelated', () => {
    // Running shoes tabs (amazon + runnersworld) vs React + Amazon
    const shoesSim = scorer.similarity(3, 4);
    const reactVsShoes = scorer.similarity(0, 3);
    expect(shoesSim).toBeGreaterThan(reactVsShoes);
  });

  test('similarity is symmetric', () => {
    expect(scorer.similarity(0, 3)).toBe(scorer.similarity(3, 0));
    expect(scorer.similarity(1, 4)).toBe(scorer.similarity(4, 1));
  });

  test('similarity is between 0 and 1', () => {
    for (let i = 0; i < tabs.length; i++) {
      for (let j = 0; j < tabs.length; j++) {
        const s = scorer.similarity(i, j);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
      }
    }
  });

  test('size returns correct count', () => {
    expect(scorer.size).toBe(5);
  });
});

// --- kNearest ---

describe('kNearest', () => {
  const tabs = makeTabs([
    { title: 'React Docs', domain: 'react.dev', path: '/docs' },
    { title: 'React Tutorial', domain: 'react.dev', path: '/tutorial' },
    { title: 'Vue Guide', domain: 'vuejs.org', path: '/guide' },
    { title: 'Cooking Recipes', domain: 'allrecipes.com', path: '/recipes' },
  ]);

  const scorer = buildSimilarityScorer(tabs);

  test('returns k results', () => {
    const nearest = scorer.kNearest(0, 2);
    expect(nearest).toHaveLength(2);
  });

  test('results are sorted by score descending', () => {
    const nearest = scorer.kNearest(0, 3);
    for (let i = 1; i < nearest.length; i++) {
      expect(nearest[i - 1].score).toBeGreaterThanOrEqual(nearest[i].score);
    }
  });

  test('does not include self', () => {
    const nearest = scorer.kNearest(0, 3);
    expect(nearest.every(n => n.index !== 0)).toBe(true);
  });

  test('nearest to React Docs is React Tutorial', () => {
    const nearest = scorer.kNearest(0, 1);
    expect(nearest[0].index).toBe(1);
  });
});

// --- buildMatrix ---

describe('buildMatrix', () => {
  const tabs = makeTabs([
    { title: 'Tab A', domain: 'a.com', path: '/page' },
    { title: 'Tab B', domain: 'b.com', path: '/page' },
    { title: 'Tab C', domain: 'c.com', path: '/other' },
  ]);

  const scorer = buildSimilarityScorer(tabs);
  const matrix = scorer.buildMatrix();

  test('matrix has correct dimensions', () => {
    expect(matrix.length).toBe(9); // 3x3
  });

  test('diagonal is 1', () => {
    expect(matrix[0]).toBe(1); // [0,0]
    expect(matrix[4]).toBe(1); // [1,1]
    expect(matrix[8]).toBe(1); // [2,2]
  });

  test('matrix is symmetric', () => {
    expect(matrix[1]).toBe(matrix[3]); // [0,1] == [1,0]
    expect(matrix[2]).toBe(matrix[6]); // [0,2] == [2,0]
    expect(matrix[5]).toBe(matrix[7]); // [1,2] == [2,1]
  });
});

// --- Domain Group Matrix Adapter ---

describe('buildDomainGroupMatrix', () => {
  const tabs = makeTabs([
    { title: 'React Docs', domain: 'react.dev', path: '/docs' },
    { title: 'React Hooks', domain: 'react.dev', path: '/hooks' },
    { title: 'TypeScript Handbook', domain: 'typescriptlang.org', path: '/handbook' },
    { title: 'Buy Shoes', domain: 'amazon.com', path: '/shoes' },
  ]);

  const domainGroups: DomainGroup[] = [
    { domain: 'react.dev', tabs: [tabs[0], tabs[1]] },
    { domain: 'typescriptlang.org', tabs: [tabs[2]] },
    { domain: 'amazon.com', tabs: [tabs[3]] },
  ];

  const scorer = buildSimilarityScorer(tabs);
  const matrix = buildDomainGroupMatrix(tabs, domainGroups, scorer);

  test('self-similarity is 1', () => {
    expect(getSimilarity(matrix, 'react.dev', 'react.dev')).toBe(1);
    expect(getSimilarity(matrix, 'amazon.com', 'amazon.com')).toBe(1);
  });

  test('matrix is symmetric', () => {
    expect(getSimilarity(matrix, 'react.dev', 'amazon.com'))
      .toBe(getSimilarity(matrix, 'amazon.com', 'react.dev'));
  });

  test('matrix contains all domain groups', () => {
    for (const g of domainGroups) {
      expect(matrix.has(g.domain)).toBe(true);
    }
  });
});

// --- clusterKeywords ---

describe('clusterKeywords', () => {
  const tabs = makeTabs([
    { title: 'React Documentation', domain: 'react.dev', path: '/docs/getting-started' },
    { title: 'React Hooks Reference', domain: 'react.dev', path: '/docs/hooks' },
    { title: 'Buy Running Shoes', domain: 'amazon.com', path: '/shoes/running' },
    { title: 'Best Running Shoes 2024', domain: 'runnersworld.com', path: '/gear/shoes' },
  ]);

  const scorer = buildSimilarityScorer(tabs);

  test('returns keywords related to cluster content', () => {
    // React cluster (tabs 0, 1) — keywords come from title+path tokens
    const reactKeywords = scorer.clusterKeywords([0, 1], 5);
    // Should contain distinguishing terms from the React tabs
    expect(reactKeywords.length).toBeGreaterThan(0);
    // "hooks", "documentation", "reference" etc. are distinctive to this cluster
    expect(reactKeywords.some(k => ['hooks', 'documentation', 'reference', 'react', 'getting', 'started'].includes(k))).toBe(true);
  });

  test('running shoes cluster returns relevant keywords', () => {
    // Shoes cluster (tabs 2, 3)
    const shoesKeywords = scorer.clusterKeywords([2, 3], 3);
    expect(shoesKeywords).toContain('shoes');
    expect(shoesKeywords).toContain('running');
  });

  test('returns at most topN keywords', () => {
    const keywords = scorer.clusterKeywords([0, 1, 2, 3], 2);
    expect(keywords.length).toBeLessThanOrEqual(2);
  });

  test('returns empty array for empty tab indices', () => {
    const keywords = scorer.clusterKeywords([], 3);
    expect(keywords).toHaveLength(0);
  });
});

// --- nameClusters ---

describe('nameClusters', () => {
  const tabs = makeTabs([
    { title: 'React Documentation', domain: 'react.dev', path: '/docs/getting-started' },
    { title: 'React Hooks Reference', domain: 'react.dev', path: '/docs/hooks' },
    { title: 'Buy Running Shoes', domain: 'amazon.com', path: '/shoes/running' },
    { title: 'Best Running Shoes 2024', domain: 'runnersworld.com', path: '/gear/shoes' },
  ]);

  const scorer = buildSimilarityScorer(tabs);

  test('assigns title-cased names to clusters', () => {
    const clusters: Cluster[] = [
      { id: 1, domainGroups: [{ domain: 'react.dev', tabs: [tabs[0], tabs[1]] }] },
      { id: 2, domainGroups: [{ domain: 'amazon.com', tabs: [tabs[2]] }, { domain: 'runnersworld.com', tabs: [tabs[3]] }] },
    ];

    const names = nameClusters(clusters, tabs, scorer);
    const values = Array.from(names.values());

    // Names should be title-cased
    for (const name of values) {
      expect(name[0]).toBe(name[0].toUpperCase());
    }
  });

  test('deduplicates names across clusters', () => {
    // Two clusters with very similar content — should get different names
    const clusters: Cluster[] = [
      { id: 1, domainGroups: [{ domain: 'react.dev', tabs: [tabs[0]] }] },
      { id: 2, domainGroups: [{ domain: 'react.dev', tabs: [tabs[1]] }] },
    ];

    const names = nameClusters(clusters, tabs, scorer);
    const values = Array.from(names.values());

    // All names should be unique
    expect(new Set(values).size).toBe(values.length);
  });

  test('falls back to domain when no keywords available', () => {
    const emptyTabs = makeTabs([
      { title: '', domain: 'example.com', path: '/' },
    ]);
    const emptyScorer = buildSimilarityScorer(emptyTabs);
    const clusters: Cluster[] = [
      { id: 1, domainGroups: [{ domain: 'example.com', tabs: [emptyTabs[0]] }] },
    ];

    const names = nameClusters(clusters, emptyTabs, emptyScorer);
    const name = Array.from(names.values())[0];

    // Should have some name (domain fallback)
    expect(name.length).toBeGreaterThan(0);
  });

  test('returns correct number of entries', () => {
    const clusters: Cluster[] = [
      { id: 1, domainGroups: [{ domain: 'react.dev', tabs: [tabs[0], tabs[1]] }] },
      { id: 2, domainGroups: [{ domain: 'amazon.com', tabs: [tabs[2]] }, { domain: 'runnersworld.com', tabs: [tabs[3]] }] },
    ];

    const names = nameClusters(clusters, tabs, scorer);
    expect(names.size).toBe(2);
  });
});

// --- Performance ---

describe('performance', () => {
  test('100 tabs completes in under 100ms', () => {
    const tabs = makeTabs(
      Array.from({ length: 100 }, (_, i) => ({
        title: `Tab number ${i} about ${['react', 'typescript', 'cooking', 'sports', 'music'][i % 5]}`,
        domain: `domain${i % 20}.com`,
        path: `/path/${i}`,
      }))
    );

    const start = performance.now();
    const scorer = buildSimilarityScorer(tabs);
    // Force computation of all pairs
    for (let i = 0; i < tabs.length; i++) {
      scorer.kNearest(i, 5);
    }
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(100);
  });
});
