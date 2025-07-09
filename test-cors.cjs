const https = require('https');

console.log('=== TESTE CORS E HEADERS DO FRONTEND ===');

// Simular exatamente como o frontend faz a requisição
const testLogin = () => {
  return new Promise((resolve, reject) => {
    const loginData = {
      email: 'ADmemjr@Gmail',
      senha_hash: 'AuG6466'
    };

    const postData = JSON.stringify(loginData);

    const options = {
      hostname: 'controle-de-estoque-web-api.onrender.com',
      port: 443,
      path: '/sessao',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://localhost:2002', // Simular origem do frontend
        'Referer': 'https://localhost:2002/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    };

    console.log('Testando POST /sessao com headers do frontend...');
    console.log('Dados:', loginData);
    console.log('Headers:', options.headers);
    console.log('');
    
    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Headers de resposta:', res.headers);
      console.log('');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Resposta:');
        try {
          const response = JSON.parse(data);
          console.log(JSON.stringify(response, null, 2));
          
          if (response.token) {
            console.log('\n✅ LOGIN FUNCIONOU! Token recebido.');
          } else {
            console.log('\n❌ Login falhou, sem token.');
          }
        } catch (e) {
          console.log('Resposta não é JSON válido:');
          console.log(data);
        }
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error.message);
      console.error('Código do erro:', error.code);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Timeout na requisição');
      req.abort();
      reject(new Error('Timeout'));
    });

    req.setTimeout(30000);
    req.write(postData);
    req.end();
  });
};

// Teste OPTIONS (preflight CORS)
const testOptions = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'controle-de-estoque-web-api.onrender.com',
      port: 443,
      path: '/sessao',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://localhost:2002',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,accept'
      },
      timeout: 10000
    };

    console.log('\n=== TESTE PREFLIGHT CORS ===');
    console.log('Testando OPTIONS /sessao...');
    
    const req = https.request(options, (res) => {
      console.log(`Status OPTIONS: ${res.statusCode}`);
      console.log('Headers CORS:', {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials']
      });
      
      if (res.headers['access-control-allow-origin']) {
        console.log('✅ CORS está configurado no servidor');
      } else {
        console.log('❌ CORS pode não estar configurado corretamente');
      }
      
      resolve({ status: res.statusCode });
    });

    req.on('error', (error) => {
      console.error('Erro OPTIONS:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Timeout OPTIONS');
      req.abort();
      reject(new Error('Timeout'));
    });

    req.setTimeout(10000);
    req.end();
  });
};

// Executar testes
async function runTests() {
  try {
    await testOptions();
    await testLogin();
    
    console.log('\n=== DIAGNÓSTICO ===');
    console.log('Se o login funcionou aqui mas não no frontend, o problema pode ser:');
    console.log('1. 🔧 Configuração de proxy no Vite');
    console.log('2. 🌐 CORS entre localhost:2002 e Render');
    console.log('3. 📝 Headers diferentes entre frontend e teste');
    console.log('4. 🔒 Certificados SSL self-signed do localhost');
    
  } catch (error) {
    console.error('Erro nos testes:', error.message);
  }
}

runTests();
