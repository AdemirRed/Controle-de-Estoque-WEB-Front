/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from '../../components/MenuSidebar';
import HeaderComponent from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Container, Content, Form } from './styles';
import { toast } from 'react-toastify';

function Usuarios() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('usuario'); // Corrigido para valor padrão do banco
  const [editingId, setEditingId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

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
      const response = await api.get(`/usuarios/${id}`);
      const usuario = response.data;
      console.log('Detalhes do usuário:', usuario);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setPapel(usuario.papel || 'usuario'); // Fallback para 'usuario' se não houver papel
      setEditingId(id);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      // Como a lista não retorna o papel, vamos carregar os detalhes de cada usuário
      const usuariosDetalhados = await Promise.all(
        response.data.map(async (usuario) => {
          try {
            const detalhes = await api.get(`/usuarios/${usuario.id}`);
            return { ...usuario, ...detalhes.data };
          } catch (error) {
            console.error(`Erro ao carregar detalhes do usuário ${usuario.id}:`, error);
            return usuario;
          }
        })
      );
      console.log('Usuários com detalhes:', usuariosDetalhados);
      setUsuarios(usuariosDetalhados);
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

  const formatarPapel = (papel) => {
    console.log('Formatando papel:', papel);
    return papel === 'admin' ? 'Administrador' : 'Usuário';
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
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{formatarPapel(usuario.papel)}</td>
                      
                      <td>
                        <button onClick={() => loadUsuario(usuario.id)}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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