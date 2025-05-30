/* eslint-disable no-unused-vars */
import {
    MenuItem,
    Select as MuiSelect,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    Button,
    Container,
    Input,
    Label,
    RequestForm,
    RequestList,
    RequestItem
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

function showBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      // Alguns navegadores não permitem o uso direto do construtor Notification
      new window.Notification(title, { body });
    } catch (err) {
      // Fallback: apenas exibe um toast
      toast.info(`${title} - ${body}`);
    }
  }
}

// Função global para buscar requisições pendentes e notificar
function startItemRequestsPolling(user) {
  let lastPendingCount = 0;
  setInterval(async () => {
    try {
      if (!user || user.papel !== 'admin') return;
      const res = await api.get('/item-requests');
      const requests = res.data || [];
      const pendentes = requests.filter(r => r.status === 'pendente');
      if (pendentes.length > lastPendingCount) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(
            'Nova requisição pendente!',
            { body: `Você tem ${pendentes.length} requisição(ões) pendente(s) para aprovar.` }
          );
        }
      }
      lastPendingCount = pendentes.length;
    } catch (error) {
      // Silencie erros de polling
    }
  }, 180000); // 3 minutos
}

const ItemRequests = () => {
  const { user, signOut } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [lastPendingCount, setLastPendingCount] = useState(0);

  // Paginação
  const [pagina, setPagina] = useState(1);
  const requestsPorPagina = 20;
  const totalPaginas = Math.ceil(requests.length / requestsPorPagina);
  const requestsPaginados = requests.slice((pagina - 1) * requestsPorPagina, pagina * requestsPorPagina);

  React.useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);

    // Removido: lógica de permissão de notificação duplicada
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

  useEffect(() => {
    // Sempre que requests mudar, verifica se há novas pendentes (apenas admin)
    if (user?.papel === 'admin') {
      const pendentes = requests.filter(r => r.status === 'pendente');
      if (pendentes.length > lastPendingCount) {
        showBrowserNotification(
          'Nova requisição pendente!',
          `Você tem ${pendentes.length} requisição(ões) pendente(s) para aprovar.`
        );
      }
      setLastPendingCount(pendentes.length);
    }
  }, [requests, user]); // Executa sempre que requests mudar

  useEffect(() => {
    // Inicia o polling global apenas uma vez e só para admin
    if (user?.papel === 'admin' && window.__itemRequestsPollingStarted !== true) {
      window.__itemRequestsPollingStarted = true;
      startItemRequestsPolling(user);
    }
    // ...existing code...
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
      // Debug: veja o que está sendo enviado
      console.log('Enviando requisição:', body);
      await api.post('/item-requests', body);
      toast.success('Requisição enviada!');
      showBrowserNotification(
        'Requisição enviada!',
        'Sua requisição foi registrada com sucesso.'
      );
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
      // Se for aprovar, primeiro tenta registrar a movimentação
      if (status === 'aprovado') {
        const req = requests.find(r => r.id === id);
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
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      minHeight: '100vh',
      background: 'var(--dark-bg)'
    }}>
      {!sidebarOpen && (
        <button
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 3000,
            background: '#232a36',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            color: '#00eaff',
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
          <FaBars />
        </button>
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
          <div
            style={{
              minWidth: 250,
              maxWidth: 300,
              width: '100%',
              transition: 'all 0.3s',
              zIndex: 200,
              background: '#232a36',
              position: window.innerWidth <= 900 ? 'fixed' : 'relative',
              top: window.innerWidth <= 900 ? 0 : undefined,
              left: window.innerWidth <= 900 ? 0 : undefined,
              height: window.innerWidth <= 900 ? '100vh' : undefined,
              boxShadow: window.innerWidth <= 900 ? '2px 0 16px #0008' : undefined
            }}
          >
            <button
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: '#00eaff',
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
              <FaTimes />
            </button>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </div>
        </>
      )}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        padding: 0,
      }}>
        <HeaderComponent title="Requisições de Itens" user={user} onLogout={handleLogout} />
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '32px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {error && (
            <div style={{ color: 'red', marginBottom: 12 }}>
              {error}
            </div>
          )}
          {(user?.papel !== 'admin' || user?.papel === 'admin') && (
            <div style={{
              background: '#132040',
              padding: 24,
              borderRadius: 12,
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
              marginBottom: 32,
              maxWidth: 600,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h2 style={{ color: '#00eaff', marginBottom: 18, textAlign: 'center' }}>Nova Requisição</h2>
              <RequestForm onSubmit={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>
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
                      padding: '6px 10px',
                      marginLeft: 8
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
                  />
                </Label>
                <Label>
                  Observação
                  <Input
                    type="text"
                    value={novoItem.observacao}
                    onChange={e => setNovoItem({ ...novoItem, observacao: e.target.value })}
                    placeholder="Opcional"
                  />
                </Label>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Solicitar'}
                </Button>
              </RequestForm>
            </div>
          )}
          <h3 style={{
            color: '#00eaff',
            margin: '32px 0 16px 0',
            borderBottom: '1px solid #00eaff33',
            paddingBottom: 8,
            fontWeight: 600,
            fontSize: '1.2rem',
            textAlign: 'center',
            width: '100%',
            maxWidth: 700,
          }}>
            Requisições já realizadas
          </h3>
          <RequestList style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Carregando...</div>
            ) : requestsPaginados.length === 0 ? (
              <div style={{ color: '#eaf6fb', padding: 24, gridColumn: '1/-1', textAlign: 'center' }}>Nenhuma requisição encontrada.</div>
            ) : (
              requestsPaginados.map((req, idx) => {
                const itemNome = itens.find(i => i.id === req.item_id)?.nome || req.item_id;
                let solicitante = '';
                const usuarioId = req.usuario_id || req.requisitante_id;
                if (usuarios.length > 0 && usuarioId) {
                  const usuarioObj = usuarios.find(u => String(u.id) === String(usuarioId));
                  solicitante = usuarioObj ? usuarioObj.nome : usuarioId;
                } else if (usuarioId) {
                  solicitante = usuarioId;
                } else {
                  solicitante = '';
                }
                const podeExcluir = (
                  (user?.id === req.requisitante_id || !req.requisitante_id) &&
                  req.status !== 'aprovado'
                );
                const adminPodeExcluir = user?.papel === 'admin' && req.status !== 'aprovado';
                return (
                  <RequestItem key={req.id}>
                    <div style={{ flex: 1, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontWeight: 'bold',
                          background: statusColors[req.status] || '#f57c00',
                          color: '#fff',
                          marginRight: 10,
                          fontSize: '0.95em'
                        }}>
                          {statusLabels[req.status] || req.status}
                        </span>
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
                      <div style={{ marginBottom: 2, fontSize: 15 }}>
                        <strong>Solicitante:</strong> {solicitante}
                      </div>
                      {req.observacao && (
                        <div style={{ marginBottom: 2, fontSize: 14, color: '#b2bac2' }}>
                          <strong>Obs:</strong> {req.observacao}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 8,
                      marginTop: 12,
                      width: '100%',
                      justifyContent: 'flex-end'
                    }}>
                      {user?.papel === 'admin' && req.status === 'pendente' && (
                        <>
                          <button
                            style={{
                              background: '#388e3c',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                            onClick={() => handleApprove(req)}
                          >
                            Aprovar
                          </button>
                          <button
                            style={{
                              background: '#c91407',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                            onClick={() => handleReject(req)}
                          >
                            Rejeitar
                          </button>
                        </>
                      )}
                      {user?.papel === 'admin' && req.status === 'aprovado' && (
                        <button
                          style={{
                            background: '#f57c00',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleCancel(req)}
                        >
                          Cancelar
                        </button>
                      )}
                      {(adminPodeExcluir || podeExcluir) && (
                        <button
                          style={{
                            background: '#c91407',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleDeleteRequest(req.id)}
                          title="Excluir requisição"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </RequestItem>
                );
              })
            )}
          </RequestList>
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <button className="paginacao-btn" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
              <span style={{ margin: '0 12px', color: '#00eaff' }}>
                Página {pagina} de {totalPaginas}
              </span>
              <button className="paginacao-btn" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Próxima</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemRequests;
