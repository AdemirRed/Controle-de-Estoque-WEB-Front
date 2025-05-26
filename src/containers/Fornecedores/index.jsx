/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
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
    telefone_pais: '+55',
    telefone_ddd: '',
    telefone_numero: '',
    email: ''
  });

  // Adicione o controle do menu lateral responsivo
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  useEffect(() => {
    loadFornecedores();
  }, []);

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
      const fornecedor = response.data;
      // Separar telefone em partes
      let pais = '+55', ddd = '', numero = '';
      if (fornecedor.telefone) {
        // Extrai partes do telefone: +55 (51) 99775-6708 ou +55 (51) 9775-6708
        const match = fornecedor.telefone.match(/^\+?(\d{2})\s*\(?(\d{2})\)?\s*([9]?\d{4,5}-?\d{4})$/);
        if (match) {
          pais = `+${match[1]}`;
          ddd = match[2];
          numero = match[3].replace(/\D/g, '');
        } else {
          // fallback: só números
          const onlyNums = fornecedor.telefone.replace(/\D/g, '');
          if (onlyNums.length >= 12) {
            pais = `+${onlyNums.slice(0,2)}`;
            ddd = onlyNums.slice(2,4);
            numero = onlyNums.slice(4);
          }
        }
      }
      setFormData({
        nome: fornecedor.nome || '',
        telefone_pais: pais,
        telefone_ddd: ddd,
        telefone_numero: numero,
        email: fornecedor.email || ''
      });
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
      // Montar telefone no formato: +55 (51) 997756708
      const telefone = `${formData.telefone_pais} (${formData.telefone_ddd}) ${formData.telefone_numero}`;
      const payload = {
        nome: formData.nome,
        telefone,
        email: formData.email
      };
      if (editingId) {
        await api.put(`/fornecedores/${editingId}`, payload);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await api.post('/fornecedores', payload);
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
      telefone_pais: '+55',
      telefone_ddd: '',
      telefone_numero: '',
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
                <div className="telefone-fields">
                  <input
                    type="text"
                    name="telefone_pais"
                    value={formData.telefone_pais}
                    onChange={handleInputChange}
                    maxLength={3}
                    style={{ width: 50 }}
                    required
                  />
                  <input
                    type="text"
                    name="telefone_ddd"
                    value={formData.telefone_ddd}
                    onChange={handleInputChange}
                    maxLength={2}
                    placeholder="DDD"
                    required
                  />
                  <input
                    type="text"
                    name="telefone_numero"
                    value={formData.telefone_numero}
                    onChange={handleInputChange}
                    maxLength={9}
                    placeholder="Número"
                    required
                  />
                </div>
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
                    <th>Data Criação</th>
                    <th>Última Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map(fornecedor => (
                    <tr key={fornecedor.id}>
                      <td>{fornecedor.nome}</td>
                      <td>{fornecedor.telefone}</td>
                      <td>{fornecedor.email || '-'}</td>
                      <td>{formatarData(fornecedor.createdAt)}</td>
                      <td>{formatarData(fornecedor.updatedAt)}</td>
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
