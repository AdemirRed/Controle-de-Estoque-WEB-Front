import api from './api.js';

export async function login(dados) {
  try {
    const response = await api.post('/sessao', dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}
