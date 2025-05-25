import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MenuSidebar from '../../components/MenuSidebar';
import HeaderComponent from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Container, Content, Form } from './styles';

function Fornecedores() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [fornecedores, setFornecedores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      const response = await api.get('/fornecedores');
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    }
  };

  const loadFornecedor = async (id) => {
    try {
      const response = await api.get(`/fornecedores/${id}`);
      setFormData(response.data);
      setEditingId(id);
    } catch (error) {
      console.error('Erro ao carregar fornecedor:', error);
      toast.error('Erro ao carregar dados do fornecedor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/fornecedores/${editingId}`, formData);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await api.post('/fornecedores', formData);
        toast.success('Fornecedor cadastrado com sucesso!');
      }
      resetForm();
      loadFornecedores();
    } catch (error) {
      console.error('Erro ao processar fornecedor:', error);
      toast.error('Erro ao processar operação');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      email: ''
    });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await api.delete(`/fornecedores/${id}`);
        toast.success('Fornecedor excluído com sucesso!');
        loadFornecedores();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        toast.error('Erro ao excluir fornecedor');
      }
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
    <Container>
      <MenuSidebar />
      <Content>
        <HeaderComponent 
          title="Fornecedores"
          user={user}
          onLogout={handleLogout}
        />
        {user?.papel === 'admin' ? (
          <>
            <h1>{editingId ? 'Atualizar Fornecedor' : 'Cadastro de Fornecedor'}</h1>
            <Form onSubmit={handleSubmit}>
              <label>
                <span>Nome</span>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Telefone</span>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Email (Opcional)</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>

              <button type="submit">
                {editingId ? 'Atualizar' : 'Cadastrar'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </Form>

            <div className="lista-fornecedores">
              <h2>Fornecedores Cadastrados</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map(fornecedor => (
                    <tr key={fornecedor.id}>
                      <td>{fornecedor.nome}</td>
                      <td>{fornecedor.telefone}</td>
                      <td>{fornecedor.email || '-'}</td>
                      <td>
                        <button 
                          onClick={() => loadFornecedor(fornecedor.id)}
                          style={{ marginRight: '8px' }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(fornecedor.id)}
                          style={{ 
                            backgroundColor: '#DC2626',
                            '&:hover': { backgroundColor: '#B91C1C' }
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

export default Fornecedores;
