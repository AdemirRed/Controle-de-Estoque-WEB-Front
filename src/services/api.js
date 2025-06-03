import axios from 'axios';

// Usa variável de ambiente para a baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token') || sessionStorage.getItem('@App:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na resposta da API:', error);
    if (error.response) {
      console.error('Detalhes do erro:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      sessionStorage.removeItem('@App:token');
      sessionStorage.removeItem('@App:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
