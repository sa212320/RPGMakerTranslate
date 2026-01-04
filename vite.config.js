import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
