/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Corrigido o caminho do import
import api from '../../services/api';
import MenuSidebar from '../../components/MenuSidebar';
import { 
  Container, 
  FormContainer, 
  ListContainer, 
  Layout, 
  MainContent,
  Header,
  UserInfo,
  LogoutButton 
} from './styles';

const MovimentacoesEstoque = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [itens, setItens] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Novo estado para usuários
  const [formData, setFormData] = useState({
    item_id: '',
    quantidade: '',
    tipo: 'entrada',
    observacao: ''
  });

  const loadItens = async () => {
    try {
      const response = await api.get('/itens');
      setItens(response.data);
    } catch (error) {
      toast.error('Erro ao carregar itens');
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    }
  };

  const loadMovimentacoes = async () => {
    try {
      const response = await api.get('/movimentacoes-estoque');
      const movimentacoesCompletas = await Promise.all(
        response.data.map(async (mov) => {
          try {
            // Busca o item e o usuário em paralelo
            const [itemResponse, usuarioResponse] = await Promise.all([
              api.get(`/itens/${mov.item_id}`),
              // Verifica se existe usuario_id antes de fazer a requisição
              mov.usuario_id ? api.get(`/usuarios/${mov.usuario_id}`) : null
            ]);
            
            return {
              ...mov,
              item_nome: itemResponse.data.nome,
              // Se não houver usuário, usa 'Sistema' como nome padrão
              usuario_nome: usuarioResponse ? usuarioResponse.data.nome : 'Sistema'
            };
          } catch (error) {
            console.error('Erro ao carregar detalhes da movimentação:', error);
            // Em caso de erro, retorna valores padrão
            return {
              ...mov,
              item_nome: mov.item_id,
              usuario_nome: mov.usuario_id || 'Sistema'
            };
          }
        })
      );
      setMovimentacoes(movimentacoesCompletas);
    } catch (error) {
      toast.error('Erro ao carregar movimentações');
      console.error(error);
    }
  };

  useEffect(() => {
    loadItens();
    loadUsuarios();
    loadMovimentacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movimentacoes-estoque', {
        ...formData,
        usuario_id: user.id
      });
      toast.success('Movimentação registrada com sucesso!');
      loadMovimentacoes();
      setFormData({
        item_id: '',
        quantidade: '',
        tipo: 'entrada',
        observacao: ''
      });
    } catch (error) {
      toast.error('Erro ao registrar movimentação');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/movimentacoes-estoque/${id}`);
      toast.success('Movimentação removida com sucesso!');
      loadMovimentacoes();
    } catch (error) {
      toast.error('Erro ao remover movimentação');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Layout>
      <MenuSidebar />
      <MainContent>
        <Header>
          <h1>Movimentações de Estoque</h1>
          <UserInfo>
            <FaUser size={20} />
            <span>{user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}</span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt size={20} />
              Sair
            </LogoutButton>
          </UserInfo>
        </Header>

        <Container>
          <FormContainer>
            <h2>Nova Movimentação</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="item_id">Item:</label>
                <select
                  id="item_id"
                  value={formData.item_id}
                  onChange={(e) => setFormData({...formData, item_id: e.target.value})}
                  required
                >
                  <option value="">Selecione um item</option>
                  {itens.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade:</label>
                <input
                  id="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo:</label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  required
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="observacao">Observação:</label>
                <textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                  rows="3"
                />
              </div>
              <button type="submit">Registrar Movimentação</button>
            </form>
          </FormContainer>

          <ListContainer>
            <h2>Movimentações Realizadas</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Quantidade</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov) => (
                  <tr key={mov.id}>
                    <td>{mov.id}</td>
                    <td>{mov.item_nome}</td>
                    <td>{mov.quantidade}</td>
                    <td>{mov.tipo}</td>
                    <td>{mov.usuario_nome}</td>
                    <td>{new Date(mov.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(mov.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ListContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default MovimentacoesEstoque;
