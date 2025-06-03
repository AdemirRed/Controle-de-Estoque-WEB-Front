import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 2002,
    strictPort: true,
    https: {
      key: fs.readFileSync('./certs/key.pem'), // ajuste o caminho conforme seu certificado
      cert: fs.readFileSync('./certs/cert.pem'),    // ajuste o caminho conforme seu certificado
    },
    proxy: {
      '/api': {
        target: 'https://redblackspy.ddns.net:2001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'https://redblackspy.ddns.net:2001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
      '/socket': {
        target: 'wss://redblackspy.ddns.net:2010',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/socket/, '/ws'),
      }
    },
    hmr: {
      protocol: 'wss',
      host: 'redblackspy.ddns.net',
      port: 2002
    }
  },
  plugins: [react()]
});
