/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaEye, FaWindowClose } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, ButtonGroup, Container, Content, DetailsContainer, DetailsHeader, DetailsLabel, DetailsRow, DetailsValue, Form, FormContainer } from './styles';

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
      // Não precisa mais fazer requisições individuais pois a rota já retorna todos os dados
      setUsuarios(response.data);
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
        toast.error(error.response?.data?.message || 'Erro ao excluir usuário');
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
    console.log('Formatando papel:', papel);
    return papel === 'admin' ? 'Administrador' : 'Usuário';
  };

  const formatarData = (data) => {
    if (!data) return 'Não disponível';
    try {
      return new Date(data).toLocaleString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <Container>
      <MenuSidebar />
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
              <input
                type="password"
                placeholder={editingId ? 'Nova senha (opcional)' : 'Senha'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
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
                  {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{formatarPapel(usuario.papel)}</td>
                      <td>{formatarData(usuario.createdAt)}</td>
                      <td>{formatarData(usuario.updatedAt)}</td>
                      <td>
                        <button 
                          onClick={() => loadUsuario(usuario.id)}
                          style={{ marginRight: '8px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDetails(usuario.id)}
                          style={{ 
                            marginRight: '8px',
                            backgroundColor: '#bbc527'
                          }}
                        >
                          <FaEye /> Detalhes
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
                          style={{ 
                            backgroundColor: '#dc3545',
                            color: 'white'
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      {formatarData(selectedUser.createdAt)}
                    </DetailsValue>
                  </DetailsRow>
                  
                  <DetailsRow>
                    <DetailsLabel>Atualizado em:</DetailsLabel>
                    <DetailsValue>
                      {formatarData(selectedUser.updatedAt)}
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