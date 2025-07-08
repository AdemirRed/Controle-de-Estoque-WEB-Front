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
        target: 'https://controle-de-estoque-web-api.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 60000, // Aumentar timeout para APIs lentas
        headers: {
          'Connection': 'keep-alive',
          'Upgrade': 'websocket', // Tentar satisfazer o upgrade required
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Erro no proxy da API:', err.message);
            // Tentar fallback para servidor local se disponível
            if (err.code === 'ECONNREFUSED' || err.message.includes('426')) {
              console.log('Tentando fallback...');
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Requisição proxy API:', req.method, req.url);
            // Adicionar headers para tentar contornar o 426
            proxyReq.setHeader('Connection', 'Upgrade');
            proxyReq.setHeader('Upgrade', 'websocket');
          });
        }
      },
      '/auth': {
        target: 'https://controle-de-estoque-web-api.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 60000,
        headers: {
          'Connection': 'keep-alive',
          'Upgrade': 'websocket',
        },
        rewrite: (path) => path.replace(/^\/auth/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Erro no proxy de auth:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Requisição proxy auth:', req.method, req.url);
            proxyReq.setHeader('Connection', 'Upgrade');
            proxyReq.setHeader('Upgrade', 'websocket');
          });
        }
      },
      '/socket': {
        target: 'wss://controle-de-estoque-web-api.onrender.com',
        ws: true,
        changeOrigin: true,
        secure: true, // Usar certificados SSL válidos do Render
        rewrite: path => path.replace(/^\/socket/, '/ws'),
      }
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 2002
    }
  },
  plugins: [react()]
});
