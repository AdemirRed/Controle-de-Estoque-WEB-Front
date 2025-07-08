import https from 'https';

console.log('=== TESTE FINAL - API DO RENDER (ES MODULE) ===');
console.log('URL: https://controle-de-estoque-web-api.onrender.com/auth/register');
console.log('');

const userData = {
  nome: 'Teste Usuario ES',
  email: 'teste-es@example.com',
  senha: 'teste123',
  empresa: 'Empresa Teste ES',
  telefone: '11999999999'
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
    'User-Agent': 'Node.js Test Client',
    'Accept': 'application/json'
  }
};

console.log('Dados enviados:');
console.log(JSON.stringify(userData, null, 2));
console.log('');
console.log('Enviando requisição...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('');

  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta recebida:');
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Resposta não é JSON válido:');
      console.log(data);
    }
    
    if (res.statusCode === 201) {
      console.log('\n✅ SUCESSO! Usuário criado com sucesso!');
    } else if (res.statusCode === 400) {
      console.log('\n⚠️  Erro de validação ou usuário já existe');
    } else if (res.statusCode === 500) {
      console.log('\n❌ Erro interno do servidor');
    } else {
      console.log(`\n❓ Status inesperado: ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
  console.error('Detalhes:', error);
});

req.write(postData);
req.end();
