# TabIt

TabIt is a smart tab manager for Chrome that automatically organizes your tabs into meaningful groups using TF-IDF similarity scoring and Leiden community detection — all processed locally in your browser.

## Features

- **Smart Regroup** — Automatically cluster related tabs based on title and URL similarity
- **Auto Grouping** — Continuously organize new tabs as you browse
- **Group Management** — Rename groups, pick colors, ungroup, and view tabs sorted by recent access
- **Customizable** — Adjust tab range, grouping granularity, and behavior
- **Multilingual** — English, Japanese, and Spanish

## Install

Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/tabit/balfedbffogihlkfffhngojhmjpjfpcf).

## Documentation

Full documentation is available at [yucklys.github.io/TabIt](https://yucklys.github.io/TabIt/).

## Development

### Dependencies

- [Bun](https://bun.sh/)

### Build locally

1. Clone the repository:
```bash
git clone https://github.com/Yucklys/TabIt.git
```

2. Install dependencies:
```bash
bun install
```

3. Build the extension:
```bash
bun run build
```

The `build/` folder contains the unpacked extension files. Load it in Chrome via `chrome://extensions` with Developer mode enabled — see [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

### Local development

```bash
bun run dev
```

### Documentation site

```bash
bun run docs:dev     # Start dev server
bun run docs:build   # Build for production
```
