---
title: Changelog
description: TabIt version history.
---

## v1.1.0

- **Auto grouping for grouped tabs** — Auto grouping now works with tabs that are already in groups, intelligently re-evaluating placement as you browse.
- **Color picker** — Choose from 9 colors for your tab groups directly from the group menu.
- **Rename fix** — Fixed an issue where renaming a group would freeze the extension.
- **Loading page fix** — Loading pages are now treated as noise and excluded from clustering.

## v1.0.0

- **Leiden community detection** — Replaced hierarchical agglomerative clustering with the Leiden algorithm for faster and more accurate tab grouping.
- **Keyword-based group naming** — Groups are named using keyword extraction from tab titles instead of AI-generated names.
- **TF-IDF similarity scoring** — Tab similarity is computed using TF-IDF vectors for better accuracy.
- **Grouping modes** — One-time, Smart, and Aggressive grouping modes for different workflows.
- **Internationalization** — Full UI translations for English, Japanese, and Spanish.
- **Customizable parameters** — Adjustable tab range and granularity settings.
- **Incremental clustering** — Efficient re-clustering that preserves existing groups.
- **Domain coherence** — Automatic ungrouping when a tab navigates away from its group's domain pattern.
