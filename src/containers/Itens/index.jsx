import React, { useEffect, useState } from 'react';
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSave,
  FaSignOutAlt,
  FaTimes,
  FaTrash,
  FaUser,
  FaWindowClose
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
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
  Header,
  Input,
  Label,
  Layout,
  LogoutButton,
  MainContent,
  Table,
  TableContainer,
  Td,
  TextArea,
  Th,
  Title,
  UserInfo
} from './styles';

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
    preco: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
        preco: formData.preco ? parseFloat(formData.preco) : null
      });

      toast.success('Item criado com sucesso!');
      setShowForm(false);
      setFormData({
        nome: '',
        descricao: '',
        quantidade: '',
        preco: ''
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
      preco: item.preco
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
        preco: formData.preco ? parseFloat(formData.preco) : null
      });

      toast.success('Item atualizado com sucesso!');
      setShowEditForm(false);
      setSelectedItem(null);
      setFormData({
        nome: '',
        descricao: '',
        quantidade: '',
        preco: ''
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

  return (
    <Layout>
      <MenuSidebar />
      <MainContent>
        <Header>
          <h1>Produtos</h1>
          <UserInfo>
            <FaUser size={20} />
            <span style={{ color: '#fff', marginRight: '10px' }}>
              {user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}
            </span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt size={20} />
              Sair
            </LogoutButton>
          </UserInfo>
        </Header>

        <Container>
          <Title>Gerenciamento de Itens</Title>
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
                  <DetailsLabel>Preço:</DetailsLabel>
                  <DetailsValue>{formatarMoeda(selectedItem.preco)}</DetailsValue>
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
                  <Th>Preço</Th>
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
                ) : itens.length === 0 ? (
                  <tr>
                    <Td colSpan="5" style={{ textAlign: 'center' }}>
                      Nenhum item encontrado
                    </Td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <Td>{item.nome}</Td>
                      <Td>{item.quantidade}</Td>
                      <Td>{formatarMoeda(item.preco)}</Td>
                      <Td>
                        <Button
                          type="button"
                          onClick={() => handleEdit(item)}
                          style={{ marginRight: '5px' }}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDetails(item.id)}
                          style={{ marginRight: '5px', backgroundColor: '#bbc527'  }}
                        >
                          <FaEye /> Detalhes
                        </Button>
                        <Button
                          type="button"
                          className="secondary"
                          onClick={() => handleDelete(item.id)}
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

export default Itens;
