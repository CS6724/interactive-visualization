import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: false
  },
  server: {
    open: true, // Auto open browser
    port: 3000
  },
  // assetsInclude: ['**/*.css'],
});