export function login(dados) {
  return fetch('https://redblackspy.ddns.net:2001/auth/sessao', {
    method: 'POST',
    // ...existing code...
  });
}
