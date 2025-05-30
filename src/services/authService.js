const API_URL =
  import.meta.env.PROD
    ? 'https://redblackspy.ddns.net:2001/sessao'
    : '/auth/sessao';

export function login(dados) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
}
