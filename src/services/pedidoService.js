import api from './api';

export const PedidoService = {
  async listarPedidos(queryString = '') {
    try {
      const response = await api.get(`/pedidos${queryString}`);
      return {
        data: response.data.pedidos || [],
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage
      };
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      return { data: [], total: 0, totalPages: 0, currentPage: 1 };
    }
  },
  
  buscarPedido: (id) => api.get(`/pedidos/${id}`),
  
  criarPedido: (dados) => api.post('/pedidos', dados),
  
  atualizarPedido: async (id, dados) => {
    try {
      const response = await api.put(`/pedidos/${id}`, {
        ...dados,
        _timestamp: new Date().getTime() // Adicionar timestamp para evitar cache
      });
      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw error.response.data;
      }
      console.error('Erro na requisição atualizarPedido:', error.message);
      throw error;
    }
  },
  
  deletarPedido: (id) => api.delete(`/pedidos/${id}`),
  
  listarItens: () => api.get('/itens'),

  listarUnidadesMedida: () => api.get('/unidades-medida'),

  listarFornecedores: () => api.get('/fornecedores'),

  aprovarPedido: async (id, fornecedor_id) => {
    try {
      const response = await api.put(`/pedidos/${id}/aprovar`, { fornecedor_id });
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar pedido:', error.response?.data || error.message);
      throw error;
    }
  }
};
