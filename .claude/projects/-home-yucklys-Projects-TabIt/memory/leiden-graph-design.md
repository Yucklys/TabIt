# Leiden Graph-Based Tab Clustering Design

## Overview
Replace current HAC (hierarchical agglomerative clustering) with a Leiden community detection algorithm on a per-tab similarity graph.

## Graph Structure
- **Nodes:** Individual tabs (not domain groups)
- **Edges:** Undirected, weighted by cosine similarity
- **Edge rule:** k-NN + threshold hybrid
  - `edge(A, B) iff (A ∈ kNN(B) or B ∈ kNN(A)) AND sim(A, B) > τ_min`
  - k = 5–7, τ_min = 0.3–0.4
  - Edge weight = raw cosine similarity
- **Clusters:** Communities found by Leiden algorithm
- **Outliers:** Nodes with degree 0 (no edges above threshold), or communities of size 1

## Leiden Algorithm
- Optimizes modularity: dense intra-group edges, sparse inter-group edges
- No pre-specified k-clusters
- Resolution parameter controls granularity (higher = more smaller clusters)
- Guarantees connected communities (improvement over Louvain)

## Similarity Computation
- **Model:** `Xenova/all-MiniLM-L6-v2` (384-dim, ONNX, Transformers.js) — already in use
- **Key change:** Embed per-tab instead of per-domain
  - Input format: `"${domain}${path} — ${title}"` per tab
  - Current approach groups by domain first, losing intra-domain granularity
- **Cosine similarity:** Dot product of L2-normalized vectors (already implemented)
- **Future consideration:** Hybrid TF-IDF + embedding similarity for lexical + semantic coverage

## Incremental Updates (new tab arrives)
1. Compute embedding for new tab
2. Compute similarity against all existing node embeddings — O(n)
3. Find top-k neighbors, add edges where sim > τ_min
4. Check if new tab entered any existing node's top-k (may add/remove edges)
5. Run Leiden locally on affected neighborhood

## Parameters to Tune
- **τ_min (similarity threshold):** Controls graph sparsity. Too low = everything connects, too high = all outliers
- **k (k-NN):** Number of nearest neighbors per node (5–7)
- **Resolution (Leiden):** Controls cluster granularity
- **Min community size:** Communities below this are marked as outliers

## Alternatives Considered
| Algorithm | No k | Outliers | Graph-native | Incremental |
|---|---|---|---|---|
| **Leiden** | yes | via degree/size filter | yes | yes (local update) |
| DBSCAN | yes | yes (native) | no | complex |
| Affinity Propagation | yes | no | no | no (full rerun) |
| Connected Components | yes | yes (isolated) | yes | merges clusters via bridge edges |
| Louvain | yes | via filter | yes | yes, but can produce disconnected communities |

## Similarity Approach Comparison
| Approach | Speed | Quality | Notes |
|---|---|---|---|
| TF-IDF on URL+title | 100x faster | Good for lexical, no semantics | No model needed |
| all-MiniLM-L6-v2 per-tab | ~5-15ms/tab | Strong semantic similarity | Already have infra |
| Hybrid TF-IDF + embedding | Marginal overhead | Best (lexical + semantic) | Future enhancement |
| Larger model (mpnet-base) | 2x slower | Marginal gain on short text | Not worth it |

**Decision:** Per-tab embeddings with existing model. Hybrid TF-IDF is a future optimization.

## Current Pipeline (to be replaced)
```
Tabs → groupByDomain → domainSummary → embedDomains → pairwiseSimilarity → HAC → clusters
```

## Target Pipeline
```
Tabs → embedPerTab → buildKnnGraph(k, τ_min) → Leiden(resolution) → filterOutliers → clusters
```