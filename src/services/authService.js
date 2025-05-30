import api from './api';

export function login(dados) {
  return api.post('/auth/sessao', dados);
}
