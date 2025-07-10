import React, { useEffect, useState, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import Paginacao from '../../components/Paginacao';
import FiltrosPadrao from '../../components/FiltrosPadrao'; // Importação do componente FiltrosPadrao
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
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
  FullWidthField,
  ButtonContainer
} from './styles';

const statusLabels = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado'
};

const statusColors = {
  pendente: '#f57c00',
  aprovado: '#388e3c',
  rejeitado: '#c91407',
  cancelado: '#757575'
};

const ItemRequests = () => {
  const { user, signOut } = useAuth();
  const { addNotification } = useNotifications();
  const location = useLocation();
  const highlightRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const [novoItem, setNovoItem] = useState({
    itemId: '',
    quantidade: '',
    observacao: '',
    usuarioId: '' // Para admin selecionar usuário
  });
  const [submitting, setSubmitting] = useState(false);
  const [itens, setItens] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [usuarios, setUsuarios] = useState([]); // Para admin selecionar usuário
  const [usuariosCache, setUsuariosCache] = useState({}); // Cache para nomes buscados por id

  // Modal de rejeição
  const [modalRejeicao, setModalRejeicao] = useState({
    open: false,
    requisicaoId: null,
    motivo: ''
  });

  // Paginação
  const [pagina, setPagina] = useState(1);
  const requestsPorPagina = 20;
  const totalPaginas = Math.ceil(requests.length / requestsPorPagina);
  const requestsPaginados = requests.slice((pagina - 1) * requestsPorPagina, pagina * requestsPorPagina);

  const [busca, setBusca] = useState(''); // Estado para busca
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]); // Estado para período de busca

  // Processar parâmetros da URL para highlight
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightParam = searchParams.get('highlight');
    if (highlightParam) {
      setHighlightedId(parseInt(highlightParam));
    }
  }, [location.search]);

  // Scroll para o item destacado após carregamento dos dados
  React.useEffect(() => {
    if (highlightedId && requests.length > 0 && !loading) {
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
  }, [highlightedId, requests.length, loading]);

  React.useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const res = await api.get('/itens');
        setItens(res.data);
      } catch (err) {
        toast.error('Erro ao carregar itens');
      }
    };
    fetchItens();
  }, []);

  useEffect(() => {
    // Carrega usuários se admin
    if (user?.papel === 'admin') {
      api.get('/usuarios')
        .then(res => setUsuarios(res.data))
        .catch(() => toast.error('Erro ao carregar usuários'));
    }
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = user?.papel === 'admin'
          ? '/item-requests'
          : '/item-requests/minhas';
        const res = await api.get(url);
        setRequests(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Erro ao carregar requisições');
        toast.error('Erro ao carregar requisições');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Buscar estoque atual do item
      const estoqueRes = await api.get(`/itens/${novoItem.itemId}`);
      const estoqueAtual = estoqueRes.data.quantidade || 0; // <-- alterado de .estoque para .quantidade
      const quantidadeSolicitada = Number(novoItem.quantidade);

      if (quantidadeSolicitada > estoqueAtual) {
        toast.error(
          `Quantidade insuficiente em estoque. Disponível: ${estoqueAtual}, solicitado: ${quantidadeSolicitada}`
        );
        setSubmitting(false);
        return;
      }

      // 2. Se houver estoque suficiente, cria a requisição normalmente
      const body = {
        item_id: novoItem.itemId,
        quantidade: novoItem.quantidade,
        observacao: novoItem.observacao,
        status: 'pendente'
      };
      // Sempre envie o requisitante_id corretamente
      if (user?.papel === 'admin') {
        if (!novoItem.usuarioId) {
          toast.error('Selecione um usuário!');
          setSubmitting(false);
          return;
        }
        body.usuario_id = novoItem.usuarioId;
        body.requisitante_id = novoItem.usuarioId;
      } else if (user?.id) {
        body.usuario_id = user.id;
        body.requisitante_id = user.id;
      }
      console.log('Enviando requisição:', body);
      await api.post('/item-requests', body);
      
      // Notificação automática para requisição criada
      const itemSelecionado = itens.find(i => i.id === novoItem.itemId);
      const nomeItem = itemSelecionado?.nome || 'item';
      
      addNotification({
        title: '📋 Requisição Criada com Sucesso',
        body: `Sua requisição de ${nomeItem} (Qtd: ${novoItem.quantidade}) foi enviada e está aguardando aprovação.`,
        message: `Sua requisição de ${nomeItem} (Qtd: ${novoItem.quantidade}) foi enviada e está aguardando aprovação.`,
        type: 'requisicao_criada',
        action: '/item-requests'
      });
      
      toast.success('Requisição enviada!');
      setNovoItem({ itemId: '', quantidade: '', observacao: '', usuarioId: '' });
      const res = await api.get(user?.papel === 'admin' ? '/item-requests' : '/item-requests/minhas');
      setRequests(res.data);
    } catch (err) {
      // Trata erro de estoque insuficiente vindo do backend
      if (
        err?.response?.data?.code === 'INSUFFICIENT_STOCK' ||
        err?.response?.data?.message?.toLowerCase().includes('insuficiente')
      ) {
        const details = err.response.data.details;
        toast.error(
          `Quantidade insuficiente em estoque. Disponível: ${details?.currentStock ?? '-'}, solicitado: ${details?.requestedAmount ?? '-'}`
        );
      } else {
        toast.error('Erro ao enviar requisição');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const req = requests.find(r => r.id === id);
      
      // Se for aprovar, primeiro tenta registrar a movimentação
      if (status === 'aprovado') {
        if (req) {
          // Buscar nome do solicitante igual ao que aparece na tabela
          let solicitanteNome = '';
          const usuarioId = req.usuario_id || req.requisitante_id;
          if (usuarios.length > 0 && usuarioId) {
            const usuarioObj = usuarios.find(u => String(u.id) === String(usuarioId));
            solicitanteNome = usuarioObj ? usuarioObj.nome : usuarioId;
          } else if (usuarioId) {
            solicitanteNome = usuarioId;
          } else {
            solicitanteNome = '';
          }
          try {
            await api.post('/movimentacoes-estoque', {
              item_id: req.item_id,
              quantidade: req.quantidade,
              tipo: 'saida',
              observacao: `Saída automática por aprovação da requisição ${id} para ${solicitanteNome}`,
              usuario_id: req.requisitante_id || (req.usuario?.id) || (user?.id)
            });
            toast.success('Movimentação de saída registrada!');
          } catch (err) {
            const msg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              'Erro ao registrar movimentação de saída';
            toast.error(msg);
            return; // Não altera o status se der erro na movimentação
          }
        }
      }
      
      // Só altera o status se não for aprovado ou se movimentação foi registrada com sucesso
      await api.put(`/item-requests/${id}`, { status });
      
      // Notificação automática para mudança de status de requisição
      if (req) {
        const itemSelecionado = itens.find(i => i.id === req.item_id);
        const nomeItem = itemSelecionado?.nome || req.item_nome || 'item';
        const statusLabels = {
          pendente: 'Pendente',
          aprovado: 'Aprovada ✅',
          rejeitado: 'Rejeitada ❌',
          cancelado: 'Cancelada 🚫'
        };
        
        addNotification({
          title: `Requisição ${statusLabels[status] || status}`,
          body: `Sua requisição de ${nomeItem} (Qtd: ${req.quantidade}) foi ${statusLabels[status]?.toLowerCase() || status}.`,
          message: `Sua requisição de ${nomeItem} foi ${statusLabels[status]?.toLowerCase() || status}.`,
          type: 'requisicao_status_change',
          action: `/item-requests?highlight=${id}`
        });
      }
      
      toast.success('Status atualizado!');
      // Atualiza lista
      const res = await api.get('/item-requests');
      setRequests(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao atualizar status';

      // Mostra detalhes se houver
      if (err?.response?.data?.details?.reason) {
        toast.error(`${msg}: ${err.response.data.details.reason}`);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta requisição?')) return;
    try {
      await api.delete(`/item-requests/${id}`);
      toast.success('Requisição excluída!');
      // Atualiza lista
      const url = user?.papel === 'admin' ? '/item-requests' : '/item-requests/minhas';
      const res = await api.get(url);
      setRequests(res.data);
    } catch (err) {
      toast.error('Erro ao excluir requisição');
    }
  };

  const handleApprove = async (req) => {
    // Aprovar: saída do estoque e status aprovado
    try {
      // Registrar saída
      let solicitanteNome = '';
      const usuarioId = req.usuario_id || req.requisitante_id;
      if (usuarios.length > 0 && usuarioId) {
        const usuarioObj = usuarios.find(u => String(u.id) === String(usuarioId));
        solicitanteNome = usuarioObj ? usuarioObj.nome : usuarioId;
      } else if (usuarioId) {
        solicitanteNome = usuarioId;
      }
      await api.post('/movimentacoes-estoque', {
        item_id: req.item_id,
        quantidade: req.quantidade,
        tipo: 'saida',
        observacao: `Saída automática por aprovação da requisição ${req.id} para ${solicitanteNome}`,
        usuario_id: req.requisitante_id || (req.usuario?.id) || (user?.id)
      });
      await api.put(`/item-requests/${req.id}`, { status: 'aprovado' });
      toast.success('Requisição aprovada e saída registrada!');
      const res = await api.get('/item-requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Erro ao aprovar requisição');
    }
  };

  const handleReject = async (req) => {
    // Rejeitar: só muda status
    try {
      await api.put(`/item-requests/${req.id}`, { status: 'rejeitado' });
      toast.success('Requisição rejeitada!');
      const res = await api.get('/item-requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Erro ao rejeitar requisição');
    }
  };

  const handleRejectClick = (requisicaoId) => {
    setModalRejeicao({
      open: true,
      requisicaoId: requisicaoId,
      motivo: ''
    });
  };

  const handleRejectConfirm = async () => {
    if (!modalRejeicao.motivo.trim()) {
      toast.error('Por favor, informe o motivo da rejeição');
      return;
    }

    try {
      const req = requests.find(r => r.id === modalRejeicao.requisicaoId);
      
      await api.put(`/item-requests/${modalRejeicao.requisicaoId}`, { 
        status: 'rejeitado',
        motivo_rejeicao: modalRejeicao.motivo.trim()
      });
      
      // Notificação automática para rejeição de requisição
      if (req) {
        const itemSelecionado = itens.find(i => i.id === req.item_id);
        const nomeItem = itemSelecionado?.nome || req.item_nome || 'item';
        
        addNotification({
          title: '❌ Requisição Rejeitada',
          body: `Sua requisição de ${nomeItem} foi rejeitada. Motivo: ${modalRejeicao.motivo.trim()}`,
          message: `Sua requisição de ${nomeItem} foi rejeitada. Motivo: ${modalRejeicao.motivo.trim()}`,
          type: 'requisicao_rejeitada',
          action: `/item-requests?highlight=${modalRejeicao.requisicaoId}`
        });
      }
      
      toast.success('Requisição rejeitada!');
      const url = user?.papel === 'admin' ? '/item-requests' : '/item-requests/minhas';
      const res = await api.get(url);
      setRequests(res.data);
      setModalRejeicao({ open: false, requisicaoId: null, motivo: '' });
    } catch (err) {
      toast.error('Erro ao rejeitar requisição');
    }
  };

  const handleRejectCancel = () => {
    setModalRejeicao({ open: false, requisicaoId: null, motivo: '' });
  };

  const handleCancel = async (req) => {
    // Cancelar: entrada no estoque e status cancelado
    try {
      // Registrar entrada
      let solicitanteNome = '';
      const usuarioId = req.usuario_id || req.requisitante_id;
      if (usuarios.length > 0 && usuarioId) {
        const usuarioObj = usuarios.find(u => String(u.id) === String(usuarioId));
        solicitanteNome = usuarioObj ? usuarioObj.nome : usuarioId;
      } else if (usuarioId) {
        solicitanteNome = usuarioId;
      }
      await api.post('/movimentacoes-estoque', {
        item_id: req.item_id,
        quantidade: req.quantidade,
        tipo: 'entrada',
        observacao: `Entrada automática por cancelamento da requisição ${req.id} de ${solicitanteNome}`,
        usuario_id: req.requisitante_id || (req.usuario?.id) || (user?.id)
      });
      await api.put(`/item-requests/${req.id}`, { status: 'cancelado' });
      toast.success('Requisição cancelada e itens devolvidos ao estoque!');
      const res = await api.get('/item-requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Erro ao cancelar requisição');
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
          <SidebarContainer $isMobile={window.innerWidth <= 900}>
            <CloseSidebarButton 
              $isMobile={window.innerWidth <= 900}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </CloseSidebarButton>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </SidebarContainer>
        </>
      )}
      <MainContainer>
        <HeaderComponent title="Requisições de Itens" user={user} onLogout={handleLogout} />
        <div style={{ width: '100%', maxWidth: 1200, margin: '32px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
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
          {(user?.papel !== 'admin' || user?.papel === 'admin') && (
            <NewRequestContainer>
              <RequestTitle>Nova Requisição</RequestTitle>
              <RequestForm onSubmit={handleSubmit}>
                <Label>
                  Item
                  <select
                    value={novoItem.itemId}
                    onChange={e => setNovoItem({ ...novoItem, itemId: e.target.value })}
                    required
                    style={{
                      background: '#232a36',
                      color: '#eaf6fb',
                      border: '1px solid #00eaff44',
                      borderRadius: 6,
                      padding: '8px 12px',
                      marginTop: 2,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Selecione um item</option>
                    {itens.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nome} (Qtd: {item.quantidade})
                      </option>
                    ))}
                  </select>
                </Label>

                <Label>
                  Quantidade
                  <Input
                    type="number"
                    min={1}
                    max={
                      (() => {
                        const item = itens.find(i => i.id === novoItem.itemId);
                        return item ? item.quantidade : undefined;
                      })()
                    }
                    value={novoItem.quantidade}
                    onChange={e => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                    required
                    placeholder="Digite a quantidade"
                  />
                </Label>

                {user?.papel === 'admin' && (
                  <Label>
                    Usuário
                    <select
                      value={novoItem.usuarioId}
                      onChange={e => setNovoItem({ ...novoItem, usuarioId: e.target.value })}
                      required
                      style={{
                        background: '#232a36',
                        color: '#eaf6fb',
                        border: '1px solid #00eaff44',
                        borderRadius: 6,
                        padding: '8px 12px',
                        marginTop: 2,
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Selecione um usuário</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nome}
                        </option>
                      ))}
                    </select>
                  </Label>
                )}

                <FullWidthField>
                  <Label>
                    Observação
                    <Input
                      type="text"
                      value={novoItem.observacao}
                      onChange={e => setNovoItem({ ...novoItem, observacao: e.target.value })}
                      placeholder="Observações opcionais sobre a requisição"
                    />
                  </Label>
                </FullWidthField>

                <ButtonContainer>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Solicitar Item'}
                  </Button>
                </ButtonContainer>
              </RequestForm>
            </NewRequestContainer>
          )}
          <RequestListTitle>Requisições já realizadas</RequestListTitle>
          <RequestList style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Carregando...</div>
            ) : requestsPaginados.length === 0 ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Nenhuma requisição encontrada.</div>
            ) : (
              requestsPaginados.map((req, idx) => {
                const itemNome = itens.find(i => i.id === req.item_id)?.nome || req.item_id;
                // Mostra sempre o nome do solicitante, nunca só o id
                let solicitante = '';
                if (req.usuario && req.usuario.nome) {
                  solicitante = req.usuario.nome;
                } else if (usuarios.length > 0 && (req.usuario_id || req.requisitante_id)) {
                  const usuarioObj = usuarios.find(u => String(u.id) === String(req.usuario_id || req.requisitante_id));
                  solicitante = usuarioObj ? usuarioObj.nome : '';
                } else {
                  solicitante = '';
                }
                const podeExcluir = (user?.id === req.requisitante_id || !req.requisitante_id) && req.status !== 'aprovado';
                const adminPodeExcluir = user?.papel === 'admin' && req.status !== 'aprovado';
                return (
                  <RequestItem 
                    key={req.id}
                    ref={highlightedId === req.id ? highlightRef : null}
                    style={{
                      backgroundColor: highlightedId === req.id ? '#fff3cd' : undefined,
                      border: highlightedId === req.id ? '2px solid #ffc107' : undefined,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ flex: 1, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        {user?.papel === 'admin' ? (
                          <select
                            value={req.status}
                            onChange={(e) => {
                              if (e.target.value === 'rejeitado') {
                                handleRejectClick(req.id);
                              } else {
                                handleStatusChange(req.id, e.target.value);
                              }
                            }}
                            style={{
                              backgroundColor: statusColors[req.status],
                              color: '#fff',
                              fontWeight: 'bold',
                              border: `2px solid ${statusColors[req.status]}`,
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
                            <option value="cancelado">Cancelado</option>
                          </select>
                        ) : (
                          <RequestItemStatus statusColor={statusColors[req.status]}>
                            {statusLabels[req.status] || req.status}
                          </RequestItemStatus>
                        )}
                        <span style={{ color: '#00eaff', fontWeight: 600, fontSize: 16 }}>
                          #{(req.id || '').slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Item:</strong> {itemNome}
                      </div>
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Qtd:</strong> {req.quantidade}
                      </div>
                      {/* Exibe solicitante só para admin */}
                      {user?.papel === 'admin' && (
                        <div style={{ marginBottom: 2, fontSize: 15 }}>
                          <strong>Solicitante:</strong> {solicitante || '-'}
                        </div>
                      )}
                      {req.motivo_rejeicao || req.motivo_recusa ? (
                        <div style={{ marginBottom: 2, fontSize: 14, color: '#ff6b6b' }}>
                          <strong>Motivo:</strong> {req.motivo_rejeicao || req.motivo_recusa}
                        </div>
                      ) : null}
                      {req.observacao && (
                        <div style={{ marginBottom: 2, fontSize: 14, color: '#b2bac2' }}>
                          <strong>Obs:</strong> {req.observacao}
                        </div>
                      )}
                    </div>
                    <RequestItemActions>
                      {(adminPodeExcluir || podeExcluir) && (
                        <ActionButton $bgColor="#c91407" onClick={() => handleDeleteRequest(req.id)} title="Excluir requisição">
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

          {/* Modal de Rejeição */}
          {modalRejeicao.open && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }} onClick={handleRejectCancel}>
              <div style={{
                background: '#132040',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 4px 32px 0 rgba(0, 0, 0, 0.5)',
                maxWidth: '500px',
                width: '90%',
                color: '#f3f6f9'
              }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color: '#00eaff', marginBottom: '24px', textAlign: 'center' }}>
                  Rejeitar Requisição
                </h3>
                <label style={{ display: 'flex', flexDirection: 'column', color: '#eaf6fb', fontSize: '0.95rem', gap: '6px' }}>
                  Motivo da Rejeição *
                  <textarea
                    value={modalRejeicao.motivo}
                    onChange={e => setModalRejeicao({ ...modalRejeicao, motivo: e.target.value })}
                    placeholder="Informe o motivo da rejeição da requisição..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #00eaff44',
                      background: '#181c24',
                      color: '#eaf6fb',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      minHeight: '100px',
                      marginBottom: '8px',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    onClick={handleRejectCancel}
                    style={{
                      background: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: '0.2s'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleRejectConfirm}
                    disabled={!modalRejeicao.motivo.trim()}
                    style={{
                      background: '#c91407',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: '0.2s',
                      opacity: !modalRejeicao.motivo.trim() ? 0.6 : 1
                    }}
                  >
                    Rejeitar Requisição
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ItemRequests;
