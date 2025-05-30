/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext'; // Corrigido o caminho do import
import api from '../../services/api';
import {
    Container,
    FormContainer,
    Header,
    Layout,
    ListContainer,
    LogoutButton,
    MainContent,
    UserInfo
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

  // Paginação
  const [pagina, setPagina] = useState(1);
  const movsPorPagina = 20;
  const totalPaginas = Math.ceil(movimentacoes.length / movsPorPagina);
  const movsPaginados = movimentacoes.slice((pagina - 1) * movsPorPagina, pagina * movsPorPagina);

  // Adicione o controle do menu lateral responsivo
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  useEffect(() => {
    // Fecha o menu lateral ao trocar de rota em telas pequenas
    const handleResize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fecha o menu lateral ao navegar em telas pequenas
  const handleSidebarNavigate = () => {
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

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
      {/* Botão de abrir menu lateral fixo em telas pequenas */}
      {!sidebarOpen && (
        <button
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 3000,
            background: '#132040',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            color: '#00f2fa',
            fontSize: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0008',
            cursor: 'pointer'
          }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          {/* Ícone de menu */}
          <span style={{ fontSize: 24 }}>☰</span>
        </button>
      )}
      {/* Sidebar responsivo */}
      {sidebarOpen && (
        <>
          {/* Overlay para fechar menu ao clicar fora em telas pequenas */}
          {window.innerWidth <= 900 && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                zIndex: 199
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            style={{
              minWidth: 250,
              maxWidth: 300,
              width: '100%',
              transition: 'all 0.3s',
              zIndex: 200,
              background: '#132040',
              position: window.innerWidth <= 900 ? 'fixed' : 'relative',
              top: window.innerWidth <= 900 ? 0 : undefined,
              left: window.innerWidth <= 900 ? 0 : undefined,
              height: window.innerWidth <= 900 ? '100vh' : undefined,
              boxShadow: window.innerWidth <= 900 ? '2px 0 16px #0008' : undefined
            }}
          >
            {/* Botão de fechar menu lateral só em telas pequenas */}
            <button
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: '#00f2fa',
                fontSize: 28,
                display: window.innerWidth <= 900 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3001
              }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              ×
            </button>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </div>
        </>
      )}
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
                  <th>Item</th>
                  <th>Quantidade</th>
                  <th>Tipo</th>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {movsPaginados.map((mov) => (
                  <tr key={mov.id}>
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
            {/* Paginação */}
            {totalPaginas > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <button className="paginacao-btn" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
                <span style={{ margin: '0 12px', color: '#00eaff' }}>
                  Página {pagina} de {totalPaginas}
                </span>
                <button className="paginacao-btn" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Próxima</button>
              </div>
            )}
          </ListContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default MovimentacoesEstoque;
