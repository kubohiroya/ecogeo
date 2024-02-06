/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/ecogeo/',
  cacheDir: './node_modules/.vite/ecogeo',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      // ターゲットとなる外部のURL
      '/gadm.org': {
        target: 'https://gadm.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gadm.org/, ''),
      },
      '/geodata.ucdavis.edu': {
        target: 'https://geodata.ucdavis.edu',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/geodata.ucdavis.edu/, ''),
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: './node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
