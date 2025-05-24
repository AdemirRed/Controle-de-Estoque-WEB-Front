import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 2002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://192.168.0.200:2001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'http://192.168.0.200:2001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
      '/socket': {
        target: 'ws://192.168.0.200:2003',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/socket/, '/ws'),
      }
    }
  },
  plugins: [react()]
});
