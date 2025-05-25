import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
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
import FiltrosPadrao from '../../components/FiltrosPadrao';

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

  return (
    <Layout>
      <MenuSidebar />
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
                ) : unidadesFiltradas.length === 0 ? (
                  <tr>
                    <Td colSpan="5" style={{ textAlign: 'center' }}>
                      Nenhuma unidade de medida encontrada
                    </Td>
                  </tr>
                ) : (
                  unidadesFiltradas.map((unidade) => (
                    <tr key={unidade.id}>
                      <Td>{unidade.nome}</Td>
                      <Td>{unidade.sigla}</Td>
                      <Td>{new Date(unidade.created_at).toLocaleString('pt-BR')}</Td>
                      <Td>{new Date(unidade.updated_at).toLocaleString('pt-BR')}</Td>
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
          </TableContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default UnidadesMedida;
