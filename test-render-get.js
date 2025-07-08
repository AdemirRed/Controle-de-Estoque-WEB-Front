import https from 'https';

console.log('=== TESTE SIMPLES - GET API RENDER ===');
console.log('URL: https://controle-de-estoque-web-api.onrender.com/');
console.log('');

const options = {
  hostname: 'controle-de-estoque-web-api.onrender.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Test Client',
    'Accept': 'application/json'
  }
};

console.log('Enviando requisição GET...');

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
    console.log(data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Servidor está respondendo!');
    } else if (res.statusCode === 426) {
      console.log('\n❌ Erro 426 - Upgrade Required (problema no backend)');
    } else {
      console.log(`\n❓ Status: ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
});

req.end();
