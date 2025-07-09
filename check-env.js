// Script para testar qual URL está sendo usada
console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('');

// Simular como o Vite lê as variáveis
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV || 'development';
console.log('Modo atual:', mode);

// Carregar variáveis de ambiente
const env = loadEnv(mode, process.cwd(), '');

console.log('Variáveis de ambiente carregadas:');
console.log('VITE_API_URL:', env.VITE_API_URL);
console.log('VITE_WS_URL:', env.VITE_WS_URL);
console.log('VITE_ENV:', env.VITE_ENV);

// Verificar arquivos .env existentes
import fs from 'fs';
import path from 'path';

const envFiles = ['.env', '.env.local', '.env.development', '.env.development.local', '.env.production'];

console.log('');
console.log('Arquivos .env encontrados:');
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} existe`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.includes('VITE_API_URL') && !line.trim().startsWith('#'));
    if (lines.length > 0) {
      console.log(`  → ${lines[0]}`);
    }
  } else {
    console.log(`✗ ${file} não existe`);
  }
});
