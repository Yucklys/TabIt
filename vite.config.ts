import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'public/TabIt*.png',
          dest: '.',
        }
      ]
    })
  ],
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        similarityWorker: './src/workers/similarityWorker.ts',
        serviceWorker: './src/background/serviceWorker.ts'
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'similarityWorker') {
            return 'similarityWorker.js';
          }
          if (chunkInfo.name === 'serviceWorker') {
            return 'serviceWorker.js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    }
  }
});
