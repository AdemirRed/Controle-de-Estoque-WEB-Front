import React, { useEffect, useState } from 'react';
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaWindowClose
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  ActionButton,
  AddButton,
  Button,
  ButtonGroup,
  Container,
  DetailsContainer,
  DetailsHeader,
  DetailsLabel,
  DetailsRow,
  DetailsValue,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  Layout,
  MainContent,
  Table,
  TableContainer,
  Td,
  TextArea,
  Th,
  Title
} from './styles';
import FiltrosPadrao from '../../components/FiltrosPadrao';

const Itens = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    quantidade: '',
    preco: '',
    quantidade_minima: '5' // Adicionar quantidade_minima
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);

  const formatarMoeda = (valor) => {
    return valor
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valor)
      : 'Não informado';
  };

  const carregarItens = async () => {
    try {
      setLoading(true);
      const response = await api.get('/itens');
      setItens(response.data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      toast.error('Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarItens();
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
      await api.post('/itens', {
        nome: formData.nome,
        descricao: formData.descricao,
        quantidade: parseInt(formData.quantidade),
        preco: formData.preco ? parseFloat(formData.preco) : null,
        quantidade_minima: parseInt(formData.quantidade_minima) // Adicionar quantidade_minima
      });

      toast.success('Item criado com sucesso!');
      setShowForm(false);
      setFormData({
        nome: '',
        descricao: '',
        quantidade: '',
        preco: '',
        quantidade_minima: '0' // Adicionar quantidade_minima
      });
      carregarItens(); // Recarrega a lista após criar
    } catch (error) {
      console.error('Erro ao criar item:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar item');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      quantidade_minima: item.quantidade_minima // Adicionar quantidade_minima
    });
    setShowEditForm(true);
  };

  const handleDetails = async (id) => {
    try {
      const response = await api.get(`/itens/${id}`);
      setSelectedItem(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do item');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/itens/${selectedItem.id}`, {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: formData.preco ? parseFloat(formData.preco) : null,
        quantidade_minima: parseInt(formData.quantidade_minima) // Adicionar quantidade_minima
      });

      toast.success('Item atualizado com sucesso!');
      setShowEditForm(false);
      setSelectedItem(null);
      setFormData({
        nome: '',
        descricao: '',
        quantidade: '',
        preco: '',
        quantidade_minima: '0' // Adicionar quantidade_minima
      });
      carregarItens();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(`/itens/${id}`);
        toast.success('Item excluído com sucesso!');
        carregarItens();
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        toast.error(error.response?.data?.message || 'Erro ao excluir item');
      }
    }
  };

  // Filtro dos itens
  const itensFiltrados = itens.filter(item => {
    const buscaLower = busca.trim().toLowerCase();
    const nomeOk = !buscaLower || (item.nome || '').toLowerCase().includes(buscaLower);
    // Filtro por período (created_at)
    let dataOk = true;
    if (buscaPeriodo[0] && buscaPeriodo[1]) {
      const dataItem = item.created_at ? new Date(item.created_at) : null;
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
          title="Produtos"
          user={user}
          onLogout={handleLogout}
        />
        
        <Container>
          <Title>Gerenciamento de Itens</Title>
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
          <AddButton onClick={() => setShowForm(true)}>
            <FaPlus /> Adicionar Item
          </AddButton>
          
          {/* Form Modal */}
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
                  <Label>Descrição</Label>
                  <TextArea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Quantidade *</Label>
                  <Input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Preço</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Quantidade Mínima *</Label>
                  <Input
                    type="number"
                    name="quantidade_minima"
                    value={formData.quantidade_minima}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    className="secondary"
                    onClick={() => setShowForm(false)}
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

          {/* Edit Form Modal */}
          {showEditForm && (
            <FormContainer>
              <Form onSubmit={handleUpdate}>
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
                  <Label>Descrição</Label>
                  <TextArea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Preço</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Quantidade Mínima *</Label>
                  <Input
                    type="number"
                    name="quantidade_minima"
                    value={formData.quantidade_minima}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    className="secondary"
                    onClick={() => setShowEditForm(false)}
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

          {/* Details Modal */}
          {showDetailsModal && selectedItem && (
            <FormContainer>
              <DetailsContainer>
                <DetailsHeader>Detalhes do Item</DetailsHeader>
                
                <DetailsRow>
                  <DetailsLabel>Nome:</DetailsLabel>
                  <DetailsValue>{selectedItem.nome}</DetailsValue>
                </DetailsRow>
                
                <DetailsRow>
                  <DetailsLabel>Descrição:</DetailsLabel>
                  <DetailsValue>
                    {selectedItem.descricao || 'Não informada'}
                  </DetailsValue>
                </DetailsRow>
                
                <DetailsRow>
                  <DetailsLabel>Quantidade:</DetailsLabel>
                  <DetailsValue>{selectedItem.quantidade}</DetailsValue>
                </DetailsRow>
                
                <DetailsRow>
                  <DetailsLabel>Qtd. Mínima:</DetailsLabel>
                  <DetailsValue>{selectedItem.quantidade_minima}</DetailsValue>
                </DetailsRow>

                <DetailsRow>
                  <DetailsLabel>Preço:</DetailsLabel>
                  <DetailsValue>{formatarMoeda(selectedItem.preco)}</DetailsValue>
                </DetailsRow>

                <DetailsRow>
                  <DetailsLabel>Criado em:</DetailsLabel>
                  <DetailsValue>
                    {new Date(selectedItem.created_at).toLocaleString('pt-BR')}
                  </DetailsValue>
                </DetailsRow>
                
                <DetailsRow>
                  <DetailsLabel>Atualizado em:</DetailsLabel>
                  <DetailsValue>
                    {new Date(selectedItem.updated_at).toLocaleString('pt-BR')}
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

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Quantidade</Th>
                  <Th>Qtd. Mínima</Th>
                  <Th>Preço</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <Td colSpan="7" style={{ textAlign: 'center' }}>
                      Carregando...
                    </Td>
                  </tr>
                ) : itensFiltrados.length === 0 ? (
                  <tr>
                    <Td colSpan="7" style={{ textAlign: 'center' }}>
                      Nenhum item encontrado
                    </Td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr key={item.id}>
                      <Td className="nome-item">{item.nome}</Td>
                      <Td>{item.quantidade}</Td>
                      <Td>{item.quantidade_minima}</Td>
                      <Td>{formatarMoeda(item.preco)}</Td>
                      <Td>
                        <ActionButton
                          className="edit-button"
                          onClick={() => handleEdit(item)}
                          data-tooltip="Editar"
                        >
                          <FaEdit />
                        </ActionButton>
                        <ActionButton
                          className="view-button"
                          onClick={() => handleDetails(item.id)}
                          data-tooltip="Detalhes"
                        >
                          <FaEye />
                        </ActionButton>
                        <ActionButton
                          className="delete-button"
                          onClick={() => handleDelete(item.id)}
                          data-tooltip="Excluir"
                        >
                          <FaTrash />
                        </ActionButton>
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

export default Itens;
