const API_URL = import.meta.env.VITE_API_URL;

export function login(dados) {
  return fetch(`${API_URL}/sessao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
}
