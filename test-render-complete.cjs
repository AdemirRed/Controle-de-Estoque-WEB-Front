const https = require('https');

console.log('=== TESTE DIRETO DA API DO RENDER ===');

// Primeiro, vamos testar uma rota simples (GET)
const testGet = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'controle-de-estoque-web-api.onrender.com',
      port: 443,
      path: '/',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Node.js Test Client'
      },
      timeout: 30000
    };

    console.log('Testando GET /...');
    
    const req = https.request(options, (res) => {
      console.log(`Status GET: ${res.statusCode}`);
      console.log(`Headers GET:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Resposta GET:');
        console.log(data.substring(0, 200) + '...');
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error('Erro GET:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Timeout GET');
      req.abort();
      reject(new Error('Timeout'));
    });

    req.setTimeout(30000);
    req.end();
  });
};

// Teste POST para registro
const testPost = () => {
  return new Promise((resolve, reject) => {
    const userData = {
      nome: 'Teste Usuario',
      email: 'teste@example.com',
      senha_hash: 'teste123',
      papel: 'usuario'
    };

    const postData = JSON.stringify(userData);

    const options = {
      hostname: 'controle-de-estoque-web-api.onrender.com',
      port: 443,
      path: '/usuarios',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json',
        'User-Agent': 'Node.js Test Client'
      },
      timeout: 30000
    };

    console.log('\nTestando POST /usuarios...');
    
    const req = https.request(options, (res) => {
      console.log(`Status POST: ${res.statusCode}`);
      console.log(`Headers POST:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Resposta POST:');
        try {
          const response = JSON.parse(data);
          console.log(JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('Resposta não é JSON válido:');
          console.log(data);
        }
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error('Erro POST:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Timeout POST');
      req.abort();
      reject(new Error('Timeout'));
    });

    req.setTimeout(30000);
    req.write(postData);
    req.end();
  });
};

// Executar testes
async function runTests() {
  try {
    await testGet();
    await testPost();
  } catch (error) {
    console.error('Erro nos testes:', error.message);
  }
}

runTests();
