import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '.' },
        { src: 'public/TabIt*.png', dest: '.' }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      $lib: path.resolve("./src/lib")
    }
  },
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
