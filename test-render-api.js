// Script para testar a API do Render com certificados SSL válidos
import axios from 'axios';

const API_URL = 'https://controle-de-estoque-web-api.onrender.com';

async function testRenderAPI() {
    console.log('🔄 Testando a API do Render com certificados SSL válidos...');
    
    const testUser = {
        nome: 'Usuario Teste Render',
        email: 'teste.render@example.com',
        senha_hash: 'senha123',
        papel: 'usuario'
    };
    
    try {
        console.log('📡 Enviando dados para:', API_URL);
        console.log('📦 Dados:', testUser);
        
        const response = await axios.post(`${API_URL}/usuarios`, testUser, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log('✅ Sucesso! Status:', response.status);
        console.log('📄 Resposta:', response.data);
        
    } catch (error) {
        console.log('❌ Erro:', error.message);
        
        if (error.response) {
            console.log('📊 Status do erro:', error.response.status);
            console.log('📝 Dados do erro:', error.response.data);
            console.log('🔗 Headers de resposta:', Object.fromEntries(
                Object.entries(error.response.headers).slice(0, 10)
            ));
        } else if (error.request) {
            console.log('📡 Requisição feita mas sem resposta');
            console.log('🔧 Código do erro:', error.code);
        }
        
        // Tentar despertar a API se estiver em sleep mode
        if (error.response?.status === 426 || error.code === 'ECONNREFUSED') {
            console.log('🔄 API pode estar em sleep mode. Tentando despertar...');
            await wakeUpAPI();
        }
    }
}

async function wakeUpAPI() {
    try {
        console.log('⏰ Fazendo ping para despertar a API...');
        await axios.get(API_URL, { timeout: 60000 });
        console.log('✅ API despertada! Tentando novamente em 5 segundos...');
        
        setTimeout(async () => {
            await testRenderAPI();
        }, 5000);
        
    } catch (error) {
        console.log('⚠️ Ainda com problemas para despertar a API:', error.message);
    }
}

testRenderAPI();
