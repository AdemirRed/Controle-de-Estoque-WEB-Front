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
  ActionButtonGroup,
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
  const isAdmin = user?.role === 'admin'; // Verificar se o usuário é administrador
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

  // Paginação
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 20;
  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);
  const itensPaginados = itensFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  // Adicionar controle do menu lateral responsivo
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  // Fecha o menu lateral ao navegar em telas pequenas
  const handleSidebarNavigate = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <FaPlus style={{ transform: 'rotate(90deg)' }} />
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
              <FaPlus style={{ transform: 'rotate(45deg)' }} />
            </button>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </div>
        </>
      )}
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
                  {isAdmin && <Th>Preço</Th>} {/* Mostrar preço apenas para administradores */}
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
                ) : itensPaginados.length === 0 ? (
                  <tr>
                    <Td colSpan="7" style={{ textAlign: 'center' }}>
                      Nenhum item encontrado
                    </Td>
                  </tr>
                ) : (
                  itensPaginados.map((item) => (
                    <tr key={item.id}>
                      <Td className="nome-item">{item.nome}</Td>
                      <Td>{item.quantidade}</Td>
                      <Td>{item.quantidade_minima}</Td>
                      {isAdmin && <Td>{formatarMoeda(item.preco)}</Td>} {/* Mostrar preço apenas para administradores */}
                      <Td>
                        <ActionButtonGroup>
                          <ActionButton
                            className="view-button"
                            onClick={() => handleDetails(item.id)}
                            data-tooltip="Detalhes"
                          >
                            <FaEye />
                          </ActionButton>
                          {isAdmin && (
                            <>
                              <ActionButton
                                className="edit-button"
                                onClick={() => handleEdit(item)}
                                data-tooltip="Editar"
                              >
                                <FaEdit />
                              </ActionButton>
                              <ActionButton
                                className="delete-button"
                                onClick={() => handleDelete(item.id)}
                                data-tooltip="Excluir"
                              >
                                <FaTrash />
                              </ActionButton>
                            </>
                          )}
                        </ActionButtonGroup>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
          </TableContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default Itens;
