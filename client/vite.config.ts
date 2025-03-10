import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8000
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@computer': path.resolve(__dirname, './src/computer'),
      '@query-hooks': path.resolve(__dirname, './src/query-hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types-defs': path.resolve(__dirname, './src/types-defs'),
      '@context': path.resolve(__dirname, './src/context')
    }
  }
});
