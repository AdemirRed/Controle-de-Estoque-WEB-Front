import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 2002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://192.168.0.200:2002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/auth': {
        target: 'http://192.168.0.200:2001', // Certifique-se de que este é o endpoint correto
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''), // Remove "/auth" do caminho
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
