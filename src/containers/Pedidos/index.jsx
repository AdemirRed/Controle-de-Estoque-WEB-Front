import React, { useEffect, useState, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import Paginacao from '../../components/Paginacao';
import FiltrosPadrao from '../../components/FiltrosPadrao';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { PedidoService } from '../../services/pedidoService';
import api from '../../services/api';
import {
  Button,
  Input,
  Label,
  RequestForm,
  RequestItem,
  RequestList,
  SidebarButton,
  SidebarContainer,
  CloseSidebarButton,
  MainContainer,
  NewRequestContainer,
  RequestTitle,
  RequestListTitle,
  RequestItemStatus,
  RequestItemActions,
  ActionButton,
  FormRow,
  OrDivider,
  FullWidthField,
  ButtonContainer,
  Select,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalButtonContainer,
  ModalButton,
  TextArea
} from './styles';

const statusLabels = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  entregue: 'Entregue'
};

const statusColors = {
  pendente: '#f57c00',
  aprovado: '#388e3c',
  rejeitado: '#c91407',
  entregue: '#4caf50'
};

const Pedidos = () => {
  const { user, signOut } = useAuth();
  const { addNotification } = useNotifications();
  const location = useLocation();
  const highlightRef = useRef(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const [novoPedido, setNovoPedido] = useState({
    itemId: '',
    itemNome: '',
    quantidade: '',
    unidadeMedidaId: '',
    observacoes: '',
    fornecedorId: '' // novo campo
  });
  const [submitting, setSubmitting] = useState(false);
  const [itens, setItens] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  const [modalRejeicao, setModalRejeicao] = useState({
    open: false,
    pedidoId: null,
    motivo: ''
  });

  const [modalFornecedor, setModalFornecedor] = useState({
    open: false,
    pedidoId: null,
    fornecedorId: ''
  });

  // Paginação
  const [pagina, setPagina] = useState(1);
  const pedidosPorPagina = 20;
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);
  const pedidosPaginados = pedidos.slice((pagina - 1) * pedidosPorPagina, pagina * pedidosPorPagina);

  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);

  // Função para resolver nome do usuário
  const resolverNomeUsuario = (pedido) => {
    // Se já tem o nome direto e não é um UUID/ID
    if (pedido.criado_por && typeof pedido.criado_por === 'string' && 
        !pedido.criado_por.includes('@') && 
        !pedido.criado_por.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) &&
        !pedido.criado_por.match(/^\d+$/)) {
      return pedido.criado_por;
    }
    
    // Se tem usuario_id, buscar na lista de usuários
    if (pedido.usuario_id && usuarios.length > 0) {
      const usuario = usuarios.find(u => u.id === pedido.usuario_id);
      if (usuario) {
        return usuario.nome;
      }
    }
    
    // Se criado_por é um UUID ou ID, buscar na lista de usuários
    if (pedido.criado_por && usuarios.length > 0) {
      // Buscar por ID exato (string ou number)
      let usuario = usuarios.find(u => String(u.id) === String(pedido.criado_por));
      
      // Se não encontrou, buscar por email
      if (!usuario) {
        usuario = usuarios.find(u => u.email === pedido.criado_por);
      }
      
      // Se não encontrou, buscar por nome
      if (!usuario) {
        usuario = usuarios.find(u => u.nome === pedido.criado_por);
      }
      
      if (usuario) {
        return usuario.nome;
      }
    }
    
    // Se tem usuario (objeto completo)
    if (pedido.usuario && typeof pedido.usuario === 'object') {
      return pedido.usuario.nome || pedido.usuario.email || 'Usuário não identificado';
    }
    
    // Fallback - se é um UUID ou número, mostrar como "ID não encontrado"
    if (pedido.criado_por) {
      if (pedido.criado_por.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ||
          pedido.criado_por.match(/^\d+$/)) {
        return `ID: ${pedido.criado_por.slice(0, 8)}...`;
      }
      return pedido.criado_por;
    }
    
    return 'Usuário não identificado';
  };

  // Processar parâmetros da URL para highlight
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightParam = searchParams.get('highlight');
    if (highlightParam) {
      setHighlightedId(parseInt(highlightParam));
    }
  }, [location.search]);

  // Scroll para o item destacado após carregamento dos dados
  useEffect(() => {
    if (highlightedId && pedidos.length > 0 && !loading) {
      const timer = setTimeout(() => {
        if (highlightRef.current) {
          highlightRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
      
      // Limpar highlight após 10 segundos
      const clearTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 10000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [highlightedId, pedidos.length, loading]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const res = await PedidoService.listarItens();
        setItens(res.data);
      } catch (err) {
        console.error('Erro ao carregar itens');
      }
    };
    fetchItens();
  }, []);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const res = await PedidoService.listarFornecedores();
        setFornecedores(res.data);
      } catch (err) {
        console.error('Erro ao carregar fornecedores');
      }
    };
    fetchFornecedores();
  }, []);

  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      try {
        const res = await PedidoService.listarUnidadesMedida();
        setUnidadesMedida(res.data);
      } catch (err) {
        console.error('Erro ao carregar unidades de medida');
      }
    };
    fetchUnidadesMedida();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        // Tentar endpoint alternativo se o primeiro falhar
        try {
          const response = await api.get('/usuario');
          setUsuarios(response.data);
        } catch (altErr) {
          console.error('Erro no endpoint alternativo também:', altErr);
        }
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await PedidoService.listarPedidos();
        setPedidos(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Erro ao carregar pedidos');
        console.error('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Busca o nome do usuário logado
      const criadoPor = user?.nome || user?.email || 'Usuário';

      // Busca o item selecionado para cálculo do valor_total
      let valor_total = null;
      if (novoPedido.itemId) {
        const itemSelecionado = itens.find(i => i.id === novoPedido.itemId);
        if (itemSelecionado && itemSelecionado.valor) {
          valor_total = Number(itemSelecionado.valor) * Number(novoPedido.quantidade || 0);
        }
      }

      const body = {
        quantidade: novoPedido.quantidade,
        observacoes: novoPedido.observacoes,
        status: 'pendente',
        fornecedor_id: novoPedido.fornecedorId, // sempre enviar fornecedor
        criado_por: criadoPor,
        valor_total: valor_total
      };

      // Se selecionou um item existente
      if (novoPedido.itemId) {
        body.item_id = novoPedido.itemId;
      } else {
        // Se está criando um item novo
        body.item_nome = novoPedido.itemNome;
        body.item_unidade_medida_id = novoPedido.unidadeMedidaId;
      }

      if (!novoPedido.fornecedorId) {
        setError('Fornecedor é obrigatório');
        setSubmitting(false);
        return;
      }

      await PedidoService.criarPedido(body);
      
      // Notificação automática para o usuário que criou o pedido
      const itemNomeParaNotificacao = novoPedido.itemId 
        ? itens.find(i => i.id === novoPedido.itemId)?.nome 
        : novoPedido.itemNome;
        
      addNotification({
        title: '✅ Pedido Criado com Sucesso',
        body: `Seu pedido de ${itemNomeParaNotificacao || 'item'} (Qtd: ${novoPedido.quantidade}) foi enviado e está aguardando aprovação.`,
        message: `Seu pedido de ${itemNomeParaNotificacao || 'item'} (Qtd: ${novoPedido.quantidade}) foi enviado e está aguardando aprovação.`,
        type: 'pedido_criado',
        action: '/pedidos'
      });
      
      // Toast de sucesso
      toast.success('Pedido criado com sucesso!');
      
      setNovoPedido({ itemId: '', itemNome: '', quantidade: '', unidadeMedidaId: '', observacoes: '', fornecedorId: '' });
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao enviar pedido');
      console.error('Erro ao enviar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status, fornecedorId = null) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      
      if (status === 'aprovado') {
        let fornecedorSelecionado = fornecedorId || pedido?.fornecedor_id;
        if (!fornecedorSelecionado) {
          // Abre modal para selecionar fornecedor
          setModalFornecedor({ open: true, pedidoId: id, fornecedorId: '' });
          return;
        }
        await PedidoService.atualizarPedido(id, { status, fornecedor_id: fornecedorSelecionado });
      } else {
        await PedidoService.atualizarPedido(id, { status });
      }
      
      // Notificação automática para mudança de status
      if (pedido) {
        const itemNome = itens.find(i => i.id === pedido.item_id)?.nome || pedido.item_nome || 'item';
        const statusLabels = {
          pendente: 'Pendente',
          aprovado: 'Aprovado ✅',
          rejeitado: 'Rejeitado ❌',
          entregue: 'Entregue 📦'
        };
        
        addNotification({
          title: `Pedido ${statusLabels[status] || status}`,
          body: `O pedido de ${itemNome} (ID: #${id.toString().slice(-6).toUpperCase()}) foi ${statusLabels[status]?.toLowerCase() || status}.`,
          message: `O pedido de ${itemNome} foi ${statusLabels[status]?.toLowerCase() || status}.`,
          type: 'pedido_status_change',
          action: `/pedidos?highlight=${id}`
        });
        
        // Toast de feedback
        toast.success(`Pedido ${statusLabels[status]?.toLowerCase() || status} com sucesso!`);
      }
      
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao atualizar status');
      console.error('Erro ao atualizar status');
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const handleRejectClick = (pedidoId) => {
    setModalRejeicao({
      open: true,
      pedidoId: pedidoId,
      motivo: ''
    });
  };

  const handleRejectConfirm = async () => {
    if (!modalRejeicao.motivo.trim()) {
      toast.error('Por favor, informe o motivo da rejeição');
      return;
    }

    try {
      const pedido = pedidos.find(p => p.id === modalRejeicao.pedidoId);
      
      await PedidoService.atualizarPedido(modalRejeicao.pedidoId, { 
        status: 'rejeitado',
        motivo_rejeicao: modalRejeicao.motivo.trim()
      });
      
      // Notificação automática para rejeição
      if (pedido) {
        const itemNome = itens.find(i => i.id === pedido.item_id)?.nome || pedido.item_nome || 'item';
        
        addNotification({
          title: '❌ Pedido Rejeitado',
          body: `O pedido de ${itemNome} foi rejeitado. Motivo: ${modalRejeicao.motivo.trim()}`,
          message: `O pedido de ${itemNome} foi rejeitado. Motivo: ${modalRejeicao.motivo.trim()}`,
          type: 'pedido_rejeitado',
          action: `/pedidos?highlight=${modalRejeicao.pedidoId}`
        });
        
        toast.info('Pedido rejeitado e usuário notificado');
      }
      
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
      setModalRejeicao({ open: false, pedidoId: null, motivo: '' });
    } catch (err) {
      console.error('Erro ao rejeitar pedido');
      toast.error('Erro ao rejeitar pedido');
    }
  };

  const handleRejectCancel = () => {
    setModalRejeicao({ open: false, pedidoId: null, motivo: '' });
  };

  const handleDeletePedido = async (id) => {
    // Verificar se o pedido ainda está pendente
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) {
      toast.error('Pedido não encontrado!');
      return;
    }
    
    if (pedido.status !== 'pendente') {
      toast.error('Apenas pedidos pendentes podem ser excluídos!');
      return;
    }
    
    if (!window.confirm(`Tem certeza que deseja excluir o pedido #${id}?\n\nEsta ação não pode ser desfeita.`)) return;
    
    try {
      setLoading(true);
      console.log('Tentando excluir pedido ID:', id, 'Status:', pedido.status);
      
      const response = await PedidoService.excluirPedido(id);
      console.log('Resposta da exclusão:', response);
      
      toast.success('Pedido excluído com sucesso!');
      
      // Recarregar a lista de pedidos
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data || []);
      
    } catch (err) {
      console.error('Erro detalhado ao excluir pedido:', {
        id,
        pedidoStatus: pedido.status,
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      
      let errorMessage = 'Erro ao excluir pedido. Tente novamente.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Pedido não encontrado. Pode já ter sido excluído.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Você não tem permissão para excluir este pedido.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Não é possível excluir este pedido. Verifique se não há dependências.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Apenas pedidos pendentes podem ser excluídos.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    if (signOut) signOut();
    window.location.href = '/login';
  };

  const handleSidebarNavigate = () => {
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: 'var(--dark-bg)' }}>
      {!sidebarOpen && (
        <SidebarButton onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
          <FaBars />
        </SidebarButton>
      )}
      {sidebarOpen && (
        <>
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
          <SidebarContainer isMobile={window.innerWidth <= 900}>
            <CloseSidebarButton isMobile={window.innerWidth <= 900} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
              <FaTimes />
            </CloseSidebarButton>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </SidebarContainer>
        </>
      )}
      <MainContainer>
        <HeaderComponent title="Pedidos" user={user} onLogout={handleLogout} />
        <div style={{ width: '100%', maxWidth: 1200, margin: '32px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <FiltrosPadrao
            busca={busca}
            setBusca={setBusca}
            buscaPeriodo={buscaPeriodo}
            setBuscaPeriodo={setBuscaPeriodo}
            exibirStatus={true}
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
          <NewRequestContainer>
            <RequestTitle>Novo Pedido</RequestTitle>
            <RequestForm onSubmit={handleSubmit}>
              <Label>
                Item Existente
                <Select
                  value={novoPedido.itemId}
                  onChange={e => {
                    setNovoPedido({ 
                      ...novoPedido, 
                      itemId: e.target.value,
                      itemNome: e.target.value ? '' : novoPedido.itemNome
                    });
                  }}
                >
                  <option value="">Selecione um item existente (opcional)</option>
                  {itens.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </Select>
              </Label>

              <OrDivider>
                <span>ou</span>
              </OrDivider>

              <Label>
                Nome do Item Novo
                <Input
                  type="text"
                  value={novoPedido.itemNome}
                  onChange={e => {
                    setNovoPedido({ 
                      ...novoPedido, 
                      itemNome: e.target.value,
                      itemId: e.target.value ? '' : novoPedido.itemId
                    });
                  }}
                  placeholder="Digite o nome de um item novo"
                  disabled={!!novoPedido.itemId}
                />
              </Label>

              <Label>
                Unidade de Medida
                <Select
                  value={novoPedido.unidadeMedidaId}
                  onChange={e => setNovoPedido({ ...novoPedido, unidadeMedidaId: e.target.value })}
                  required={!!novoPedido.itemNome && !novoPedido.itemId}
                  disabled={!!novoPedido.itemId}
                >
                  <option value="">Selecione uma unidade</option>
                  {unidadesMedida.map(unidade => (
                    <option key={unidade.id} value={unidade.id}>
                      {unidade.nome} ({unidade.sigla})
                    </option>
                  ))}
                </Select>
              </Label>

              <Label>
                Quantidade
                <Input
                  type="number"
                  min={1}
                  value={novoPedido.quantidade}
                  onChange={e => setNovoPedido({ ...novoPedido, quantidade: e.target.value })}
                  required
                  placeholder="Digite a quantidade"
                />
              </Label>

              <Label>
                Fornecedor *
                <Select
                  value={novoPedido.fornecedorId}
                  onChange={e => setNovoPedido({ ...novoPedido, fornecedorId: e.target.value })}
                  required
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map(f => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </Select>
              </Label>

              <FullWidthField>
                <Label>
                  Observações
                  <Input
                    type="text"
                    value={novoPedido.observacoes}
                    onChange={e => setNovoPedido({ ...novoPedido, observacoes: e.target.value })}
                    placeholder="Observações opcionais sobre o pedido"
                  />
                </Label>
              </FullWidthField>

              <ButtonContainer>
                <Button 
                  type="submit" 
                  disabled={submitting || (!novoPedido.itemId && !novoPedido.itemNome)}
                >
                  {submitting ? 'Enviando...' : 'Solicitar Pedido'}
                </Button>
              </ButtonContainer>
            </RequestForm>
          </NewRequestContainer>
          <RequestListTitle>Pedidos já realizados</RequestListTitle>
          <RequestList style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Carregando...</div>
            ) : pedidosPaginados.length === 0 ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Nenhum pedido encontrado.</div>
            ) : (
              pedidosPaginados.map((pedido, idx) => {
                const itemNome = itens.find(i => i.id === pedido.item_id)?.nome || pedido.item_nome || pedido.item_id;
                const unidadeSigla = unidadesMedida.find(u => u.id === pedido.item_unidade_medida_id)?.sigla || '';
                // Novo: valor total
                const valorTotal = pedido.valor_total !== undefined && pedido.valor_total !== null
                  ? Number(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : '-';
                return (
                  <RequestItem 
                    key={pedido.id}
                    ref={highlightedId === pedido.id ? highlightRef : null}
                    style={{
                      backgroundColor: highlightedId === pedido.id ? '#fff3cd' : undefined,
                      border: highlightedId === pedido.id ? '2px solid #ffc107' : undefined,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ flex: 1, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        {user?.papel === 'admin' ? (
                          <>
                            <Select
                              value={pedido.status}
                              onChange={(e) => {
                                if (e.target.value === 'aprovado') {
                                  // Se não tem fornecedor, abre modal
                                  if (!pedido.fornecedor_id) {
                                    setModalFornecedor({ open: true, pedidoId: pedido.id, fornecedorId: '' });
                                    return;
                                  }
                                  handleStatusChange(pedido.id, e.target.value, pedido.fornecedor_id);
                                } else if (e.target.value === 'rejeitado') {
                                  handleRejectClick(pedido.id);
                                } else {
                                  handleStatusChange(pedido.id, e.target.value);
                                }
                              }}
                              style={{
                                backgroundColor: statusColors[pedido.status],
                                color: '#fff',
                                fontWeight: 'bold',
                                border: `2px solid ${statusColors[pedido.status]}`,
                                borderRadius: '12px',
                                padding: '4px 12px',
                                marginRight: '10px',
                                fontSize: '0.95em',
                                minWidth: '120px'
                              }}
                            >
                              <option value="pendente">Pendente</option>
                              <option value="aprovado">Aprovado</option>
                              <option value="rejeitado">Rejeitado</option>
                              <option value="entregue">Entregue</option>
                            </Select>
                          </>
                        ) : (
                          <RequestItemStatus statusColor={statusColors[pedido.status]}>
                            {statusLabels[pedido.status] || pedido.status}
                          </RequestItemStatus>
                        )}
                        <span style={{ color: '#00eaff', fontWeight: 600, fontSize: 16 }}>
                          #{(pedido.id || '').slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Item:</strong> {itemNome}
                      </div>
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Qtd:</strong> {pedido.quantidade} {unidadeSigla}
                      </div>
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Fornecedor:</strong> {fornecedores.find(f => f.id === pedido.fornecedor_id)?.nome || '-'}
                      </div>
                      {/* Novo: Exibir valor total */}
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Valor Total:</strong> {valorTotal}
                      </div>
                      {/* Novo: Exibir criado por */}
                      <div style={{ marginBottom: 2, fontSize: 14, color: '#b2bac2' }}>
                        <strong>Criado por:</strong> {resolverNomeUsuario(pedido)}
                      </div>
                      {pedido.motivo_rejeicao && (
                        <div style={{ marginBottom: 2, fontSize: 14, color: '#ff6b6b' }}>
                          <strong>Motivo:</strong> {pedido.motivo_rejeicao}
                        </div>
                      )}
                      {pedido.observacoes && (
                        <div style={{ marginBottom: 2, fontSize: 14, color: '#b2bac2' }}>
                          <strong>Obs:</strong> {pedido.observacoes}
                        </div>
                      )}
                    </div>
                    <RequestItemActions>
                      {/* Só mostrar botão de excluir para pedidos pendentes */}
                      {pedido.status === 'pendente' && (
                        <ActionButton bgColor="#c91407" onClick={() => handleDeletePedido(pedido.id)} title="Excluir pedido">
                          Excluir
                        </ActionButton>
                      )}
                    </RequestItemActions>
                  </RequestItem>
                );
              })
            )}
            <Paginacao
              pagina={pagina}
              totalPaginas={totalPaginas}
              onPaginaAnterior={() => setPagina(p => Math.max(1, p - 1))}
              onPaginaProxima={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            />
          </RequestList>
        </div>
      </MainContainer>

      {/* Modal de Fornecedor para Aprovação */}
      {modalFornecedor.open && (
        <ModalOverlay onClick={() => setModalFornecedor({ open: false, pedidoId: null, fornecedorId: '' })}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Selecione o Fornecedor</ModalTitle>
            <Label>
              Fornecedor *
              <Select
                value={modalFornecedor.fornecedorId}
                onChange={e => setModalFornecedor(m => ({ ...m, fornecedorId: e.target.value }))}
                required
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </Select>
            </Label>
            <ModalButtonContainer>
              <ModalButton
                variant="secondary"
                onClick={() => setModalFornecedor({ open: false, pedidoId: null, fornecedorId: '' })}
              >
                Cancelar
              </ModalButton>
              <ModalButton
                variant="danger"
                onClick={() => {
                  if (!modalFornecedor.fornecedorId) {
                    setError('Fornecedor é obrigatório para aprovar o pedido');
                    return;
                  }
                  handleStatusChange(modalFornecedor.pedidoId, 'aprovado', modalFornecedor.fornecedorId);
                  setModalFornecedor({ open: false, pedidoId: null, fornecedorId: '' });
                }}
                disabled={!modalFornecedor.fornecedorId}
              >
                Aprovar Pedido
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Rejeição */}
      {modalRejeicao.open && (
        <ModalOverlay onClick={handleRejectCancel}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Rejeitar Pedido</ModalTitle>
            <Label>
              Motivo da Rejeição *
              <TextArea
                value={modalRejeicao.motivo}
                onChange={e => setModalRejeicao({ ...modalRejeicao, motivo: e.target.value })}
                placeholder="Informe o motivo da rejeição do pedido..."
                required
              />
            </Label>
            <ModalButtonContainer>
              <ModalButton 
                variant="secondary" 
                onClick={handleRejectCancel}
              >
                Cancelar
              </ModalButton>
              <ModalButton 
                variant="danger" 
                onClick={handleRejectConfirm}
                disabled={!modalRejeicao.motivo.trim()}
              >
                Rejeitar Pedido
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Pedidos;
