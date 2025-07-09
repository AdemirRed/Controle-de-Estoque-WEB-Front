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
      // Proxy para todas as rotas da API
      '^/(api|auth|sessao|usuarios|itens|fornecedores|movimentacoes|pedidos|relatorios)': {
        target: 'https://controle-de-estoque-web-api.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 60000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Erro no proxy:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy:', req.method, req.url, '→', options.target + req.url);
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
