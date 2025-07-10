const API_URL = import.meta.env.VITE_API_URL || '/auth';

export async function login(dados) {
  try {
    const response = await fetch(`${API_URL}/sessao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao fazer login:', errorData);
      throw new Error(errorData.message || 'Erro ao fazer login');
    }

    return response.json();
  } catch (error) {
    console.error('Erro de conexão:', error);
    throw error;
  }
}
