const https = require('https');

console.log('=== TESTE FINAL - API DO RENDER ===');
console.log('URL: https://controle-de-estoque-web-api.onrender.com/auth/register');
console.log('');

const userData = {
  nome: 'Teste Usuario',
  email: 'teste@example.com',
  senha: 'teste123',
  confirmarSenha: 'teste123'
};

const postData = JSON.stringify(userData);

const options = {
  hostname: 'controle-de-estoque-web-api.onrender.com',
  port: 443,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Accept': 'application/json',
    'User-Agent': 'Node.js Test Client'
  },
  timeout: 30000
};

console.log('Enviando requisição...');
console.log('Headers:', options.headers);
console.log('Dados:', userData);
console.log('');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Resposta da API:');
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Resposta não é JSON válido:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('Erro na requisição:', error.message);
  console.error('Código do erro:', error.code);
});

req.on('timeout', () => {
  console.error('Timeout na requisição');
  req.abort();
});

req.setTimeout(30000);

req.write(postData);
req.end();
