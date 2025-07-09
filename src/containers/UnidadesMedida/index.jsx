import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FiltrosPadrao from '../../components/FiltrosPadrao';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import Paginacao from '../../components/Paginacao';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Layout, MainContent } from '../Dashboard/styles';
import {
  AddButton,
  Button,
  ButtonGroup,
  Container,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  Table,
  TableContainer,
  Td,
  Th,
  Title
} from './styles';

const UnidadesMedida = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    sigla: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);

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

  // Função para formatar data corretamente
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

  const carregarUnidades = async () => {
    try {
      setLoading(true);
      const response = await api.get('/unidades-medida');
      setUnidades(response.data);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
      toast.error('Erro ao carregar unidades de medida');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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
        await api.put(`/unidades-medida/${editingId}`, formData);
        toast.success('Unidade de medida atualizada com sucesso!');
      } else {
        await api.post('/unidades-medida', formData);
        toast.success('Unidade de medida criada com sucesso!');
      }
      
      setShowForm(false);
      setFormData({ nome: '', sigla: '' });
      setEditingId(null);
      carregarUnidades();
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar unidade de medida');
    }
  };

  const handleEdit = (unidade) => {
    setFormData({
      nome: unidade.nome,
      sigla: unidade.sigla
    });
    setEditingId(unidade.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade de medida?')) {
      try {
        await api.delete(`/unidades-medida/${id}`);
        toast.success('Unidade de medida excluída com sucesso!');
        carregarUnidades();
      } catch (error) {
        console.error('Erro ao excluir unidade:', error);
        toast.error(error.response?.data?.message || 'Erro ao excluir unidade de medida');
      }
    }
  };

  // Filtro das unidades
  const unidadesFiltradas = unidades.filter(unidade => {
    const buscaLower = busca.trim().toLowerCase();
    const nomeOk = !buscaLower || (unidade.nome || '').toLowerCase().includes(buscaLower);
    // Filtro por período (created_at)
    let dataOk = true;
    if (buscaPeriodo[0] && buscaPeriodo[1]) {
      const dataItem = unidade.created_at ? new Date(unidade.created_at) : null;
      if (dataItem) {
        dataItem.setHours(0, 0, 0, 0);
        dataOk =
          dataItem.getTime() >= buscaPeriodo[0].setHours(0, 0, 0, 0) &&
          dataItem.getTime() <= buscaPeriodo[1].setHours(0, 0, 0, 0);
      } else {
        dataOk = false;
      }
    }
    return nomeOk && dataOk;
  });

  // Paginação
  const [pagina, setPagina] = useState(1);
  const unidadesPorPagina = 20;
  const totalPaginas = Math.ceil(unidadesFiltradas.length / unidadesPorPagina);
  const unidadesPaginadas = unidadesFiltradas.slice((pagina - 1) * unidadesPorPagina, pagina * unidadesPorPagina);

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
        <HeaderComponent 
          title="Unidades de Medida"
          user={user}
          onLogout={handleLogout}
        />
        
        <Container>
          <Title>Gerenciamento de Unidades de Medida</Title>
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
          <AddButton onClick={() => {
            setFormData({ nome: '', sigla: '' });
            setEditingId(null);
            setShowForm(true);
          }}>
            <FaPlus /> Adicionar Unidade
          </AddButton>

          {showForm && (
            <FormContainer>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Nome *</Label>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Sigla *</Label>
                  <Input
                    name="sigla"
                    value={formData.sigla}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    <FaTimes /> Cancelar
                  </Button>
                  <Button type="submit" className="primary">
                    <FaSave /> Salvar
                  </Button>
                </ButtonGroup>
              </Form>
            </FormContainer>
          )}

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Sigla</Th>
                  <Th>Data Criação</Th>
                  <Th>Última Atualização</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <Td colSpan="5" style={{ textAlign: 'center' }}>
                      Carregando...
                    </Td>
                  </tr>
                ) : unidadesPaginadas.length === 0 ? (
                  <tr>
                    <Td colSpan="5" style={{ textAlign: 'center' }}>
                      Nenhuma unidade de medida encontrada
                    </Td>
                  </tr>
                ) : (
                  unidadesPaginadas.map((unidade) => (
                    <tr key={unidade.id}>
                      <Td>{unidade.nome}</Td>
                      <Td>{unidade.sigla}</Td>
                      <Td>{formatarData(unidade.createdAt || unidade.created_at)}</Td>
                      <Td>{formatarData(unidade.updatedAt || unidade.updated_at)}</Td>
                      <Td>
                        <Button
                          type="button"
                          className="primary"
                          onClick={() => handleEdit(unidade)}
                          style={{ marginRight: '8px' }}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          type="button"
                          className="secondary"
                          onClick={() => handleDelete(unidade.id)}
                        >
                          <FaTrash /> Excluir
                        </Button>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <Paginacao
              pagina={pagina}
              totalPaginas={totalPaginas}
              onPaginaAnterior={() => setPagina(p => Math.max(1, p - 1))}
              onPaginaProxima={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            />
          </TableContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default UnidadesMedida;
