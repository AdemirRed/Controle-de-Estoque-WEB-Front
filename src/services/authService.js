export function login(dados) {
  return fetch('/auth/sessao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
}
