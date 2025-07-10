/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaEye, FaWindowClose, FaEdit, FaTrash } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import Paginacao from '../../components/Paginacao';
import FiltrosPadrao from '../../components/FiltrosPadrao'; // Importação do componente FiltrosPadrao
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, ButtonGroup, Container, Content, DetailsContainer, DetailsHeader, DetailsLabel, DetailsRow, DetailsValue, Form, FormContainer, ActionButton, ActionButtonGroup } from './styles';

function Usuarios() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('usuario'); // Corrigido para valor padrão do banco
  const [editingId, setEditingId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Adicione o controle do menu lateral responsivo
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  // Paginação
  const [pagina, setPagina] = useState(1);
  const usuariosPorPagina = 20;
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);
  const usuariosPaginados = usuarios.slice((pagina - 1) * usuariosPorPagina, pagina * usuariosPorPagina);

  // Filtros
  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);

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

  useEffect(() => {
    loadUsuarios();
  }, []);

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setPapel('usuario'); // Corrigido para valor padrão do banco
    setEditingId(null);
  };

  const loadUsuario = async (id) => {
    try {
      const usuarioParaEditar = usuarios.find(u => u.id === id);
      if (usuarioParaEditar) {
        setNome(usuarioParaEditar.nome);
        setEmail(usuarioParaEditar.email);
        setPapel(usuarioParaEditar.papel || 'usuario');
        setEditingId(id);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      const usuariosBase = response.data;

      // Buscar o papel de cada usuário individualmente
      const usuariosComPapel = await Promise.all(
        usuariosBase.map(async (u) => {
          try {
            const res = await api.get(`/usuarios/${u.id}`);
            return { ...u, papel: res.data.papel };
          } catch {
            // Se falhar, retorna sem papel
            return { ...u, papel: undefined };
          }
        })
      );
      setUsuarios(usuariosComPapel);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!nome.trim() || !email.trim()) {
        toast.warning('Nome e email são obrigatórios');
        return;
      }
      if (!editingId && !senha.trim()) {
        toast.warning('A senha é obrigatória para novos usuários');
        return;
      }

      // Modificado para usar senha_hash ao invés de senha
      const userData = {
        nome: nome.trim(),
        email: email.trim(),
        senha_hash: senha.trim(), // Alterado aqui
        papel: papel
      };

      console.log('Dados sendo enviados:', { ...userData, senha_hash: '***' });

      if (editingId) {
        if (!senha.trim()) {
          delete userData.senha_hash;
        }
        await api.put(`/usuarios/${editingId}`, userData);
        toast.success('Usuário atualizado com sucesso!');
        resetForm();
        loadUsuarios();
      } else {
        if (!userData.nome || !userData.email || !userData.senha_hash || !userData.papel) {
          toast.warning('Todos os campos são obrigatórios para criar um novo usuário');
          return;
        }
        const response = await api.post('/usuarios', userData);
        if (response.data) {
          toast.success('Usuário criado com sucesso!');
          resetForm();
          loadUsuarios();
        }
      }
    } catch (error) {
      if (error.response?.data?.details) {
        toast.error(error.response.data.details.join('\n'));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao processar a operação. Verifique os dados e tente novamente.');
      }
      console.error('Erro na operação:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        toast.success('Usuário excluído com sucesso!');
        loadUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        if (error.response?.status === 404) {
          toast.error('Usuário não encontrado ou já foi removido.');
        } else {
          toast.error(error.response?.data?.message || 'Erro ao excluir usuário');
        }
      }
    }
  };

  const handleDetails = (id) => {
    const usuarioSelecionado = usuarios.find(u => u.id === id);
    if (usuarioSelecionado) {
      setSelectedUser(usuarioSelecionado);
      setShowDetailsModal(true);
    } else {
      toast.error('Usuário não encontrado');
    }
  };

  const formatarPapel = (papel) => {
    if (papel === null || papel === undefined || (typeof papel === 'string' && papel.trim() === '')) return 'Não informado';
    const papelLower = String(papel).trim().toLowerCase();
    if (['admin', 'administrador', 'adm'].includes(papelLower)) return 'Administrador';
    if (['usuario', 'usuário', 'user'].includes(papelLower)) return 'Usuário';
    return papel.charAt(0).toUpperCase() + papel.slice(1);
  };

  const formatarData = (data) => {
    if (!data) return 'Não disponível';
    try {
      // Remove qualquer caractere inválido e garante que é uma string válida
      const dataLimpa = String(data).trim();
      
      if (!dataLimpa || dataLimpa === 'null' || dataLimpa === 'undefined') {
        return 'Data não disponível';
      }
      
      const dataObj = new Date(dataLimpa);
      
      // Verifica se a data é válida
      if (isNaN(dataObj.getTime())) {
        console.error('Data inválida:', data);
        return 'Data inválida';
      }
      
      return dataObj.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error, 'Data original:', data);
      return 'Erro na data';
    }
  };

  return (
    <Container>
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
      <Content>
        <HeaderComponent 
          title="Usuários"
          user={user}
          onLogout={handleLogout}
        />
        {user?.papel === 'admin' ? (
          <>
            <h1>{editingId ? 'Atualizar Usuário' : 'Cadastro de Usuários'}</h1>
            <Form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <label htmlFor="senha" style={{ color: '#fff', fontSize: 14, marginBottom: 2 }}>
                  {editingId ? 'Nova senha (opcional)' : 'Senha:'}
                </label>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  marginBottom: 2,
                  marginTop: 2
                }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#4a90e2',
                      fontSize: 22,
                      position: 'absolute',
                      top: '9px', // centralizado
                      right: '12px',
                      zIndex: 2
                    }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingId ? 'Nova senha (opcional)' : 'Senha'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required={!editingId}
                    autoComplete={editingId ? 'new-password' : 'current-password'}
                    style={{ width: '100%', paddingRight: 38, marginTop: 0 }}
                  />
                </div>
              </div>
              <label>
                <span>Papel do Usuário</span>
                <select 
                  value={papel}
                  onChange={e => setPapel(e.target.value)}
                >
                  <option value="usuario">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
              {editingId && (
                <button type="button" onClick={resetForm}>Cancelar</button>
              )}
            </Form>

            <FiltrosPadrao
              busca={busca}
              setBusca={setBusca}
              buscaPeriodo={buscaPeriodo}
              setBuscaPeriodo={setBuscaPeriodo}
              exibirStatus={false}
              onLimpar={() => {
                setBusca('');
                setBuscaPeriodo([null, null]);
              }}
              onHoje={() => {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                setBuscaPeriodo([hoje, hoje]);
              }}
              onSemana={() => {
                const hoje = new Date();
                const inicio = new Date(hoje);
                inicio.setDate(hoje.getDate() - hoje.getDay());
                inicio.setHours(0, 0, 0, 0);
                const fim = new Date(inicio);
                fim.setDate(inicio.getDate() + 6);
                setBuscaPeriodo([inicio, fim]);
              }}
              onMes={() => {
                const hoje = new Date();
                const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
                setBuscaPeriodo([inicio, fim]);
              }}
              resetPagina={() => setPagina(1)} // Reseta a página ao aplicar filtros
            />

            <div className="lista-usuarios">
              <h2>Usuários Cadastrados</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Papel</th>
                    <th>Data Criação</th>
                    <th>Última Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPaginados.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{formatarPapel(usuario.papel)}</td>
                      <td>{formatarData(usuario.createdAt || usuario.created_at)}</td>
                      <td>{formatarData(usuario.updatedAt || usuario.updated_at)}</td>
                      <td>
                        <ActionButtonGroup>
                          <ActionButton
                            className="edit-button"
                            onClick={() => loadUsuario(usuario.id)}
                            data-tooltip="Editar"
                          >
                            <FaEdit />
                          </ActionButton>
                          <ActionButton
                            className="view-button"
                            onClick={() => handleDetails(usuario.id)}
                            data-tooltip="Detalhes"
                          >
                            <FaEye />
                          </ActionButton>
                          <ActionButton
                            className="delete-button"
                            onClick={() => handleDelete(usuario.id)}
                            data-tooltip="Excluir"
                          >
                            <FaTrash />
                          </ActionButton>
                        </ActionButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Paginação */}
              <Paginacao
                pagina={pagina}
                totalPaginas={totalPaginas}
                onPaginaAnterior={() => setPagina(p => Math.max(1, p - 1))}
                onPaginaProxima={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              />
            </div>

            {showDetailsModal && selectedUser && (
              <FormContainer>
                <DetailsContainer>
                  <DetailsHeader>Detalhes do Usuário</DetailsHeader>
                  
                  <DetailsRow>
                    <DetailsLabel>Nome:</DetailsLabel>
                    <DetailsValue>{selectedUser.nome}</DetailsValue>
                  </DetailsRow>
                  
                  <DetailsRow>
                    <DetailsLabel>Email:</DetailsLabel>
                    <DetailsValue>{selectedUser.email}</DetailsValue>
                  </DetailsRow>
                  
                  <DetailsRow>
                    <DetailsLabel>Papel:</DetailsLabel>
                    <DetailsValue>{formatarPapel(selectedUser.papel)}</DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Criado em:</DetailsLabel>
                    <DetailsValue>
                      {formatarData(selectedUser.createdAt || selectedUser.created_at)}
                    </DetailsValue>
                  </DetailsRow>
                  
                  <DetailsRow>
                    <DetailsLabel>Atualizado em:</DetailsLabel>
                    <DetailsValue>
                      {formatarData(selectedUser.updatedAt || selectedUser.updated_at)}
                    </DetailsValue>
                  </DetailsRow>

                  <ButtonGroup>
                    <Button
                      type="button"
                      className="secondary"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      <FaWindowClose /> Fechar
                    </Button>
                  </ButtonGroup>
                </DetailsContainer>
              </FormContainer>
            )}

          </>
        ) : (
          <div style={{ 
            color: '#fff', 
            textAlign: 'center', 
            marginTop: '2rem',
            padding: '2rem',
            background: '#1f2937',
            borderRadius: '8px' 
          }}>
            <h2>Acesso Restrito</h2>
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        )}
      </Content>
    </Container>
  );
}

export default Usuarios;