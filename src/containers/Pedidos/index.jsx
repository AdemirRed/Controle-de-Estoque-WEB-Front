/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import HeaderComponent from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import Paginacao from '../../components/Paginacao';
import FiltrosPadrao from '../../components/FiltrosPadrao';
import { useAuth } from '../../context/AuthContext';
import { PedidoService } from '../../services/pedidoService';
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
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoPedido, setNovoPedido] = useState({
    itemId: '',
    itemNome: '',
    quantidade: '',
    unidadeMedidaId: '',
    observacoes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [itens, setItens] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  const [modalRejeicao, setModalRejeicao] = useState({
    open: false,
    pedidoId: null,
    motivo: ''
  });

  // Paginação
  const [pagina, setPagina] = useState(1);
  const pedidosPorPagina = 20;
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);
  const pedidosPaginados = pedidos.slice((pagina - 1) * pedidosPorPagina, pagina * pedidosPorPagina);

  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);

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
      const body = {
        quantidade: novoPedido.quantidade,
        observacoes: novoPedido.observacoes,
        status: 'pendente'
      };

      // Se selecionou um item existente
      if (novoPedido.itemId) {
        body.item_id = novoPedido.itemId;
      } else {
        // Se está criando um item novo
        body.item_nome = novoPedido.itemNome;
        body.item_unidade_medida_id = novoPedido.unidadeMedidaId;
      }

      await PedidoService.criarPedido(body);
      setNovoPedido({ itemId: '', itemNome: '', quantidade: '', unidadeMedidaId: '', observacoes: '' });
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
    } catch (err) {
      console.error('Erro ao enviar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await PedidoService.atualizarPedido(id, { status });
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
    } catch (err) {
      console.error('Erro ao atualizar status');
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
      console.error('Por favor, informe o motivo da rejeição');
      return;
    }

    try {
      await PedidoService.atualizarPedido(modalRejeicao.pedidoId, { 
        status: 'rejeitado',
        motivo_rejeicao: modalRejeicao.motivo.trim()
      });
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
      setModalRejeicao({ open: false, pedidoId: null, motivo: '' });
    } catch (err) {
      console.error('Erro ao rejeitar pedido');
    }
  };

  const handleRejectCancel = () => {
    setModalRejeicao({ open: false, pedidoId: null, motivo: '' });
  };

  const handleDeletePedido = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;
    try {
      await PedidoService.excluirPedido(id);
      const res = await PedidoService.listarPedidos();
      setPedidos(res.data);
    } catch (err) {
      console.error('Erro ao excluir pedido');
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
                return (
                  <RequestItem key={pedido.id}>
                    <div style={{ flex: 1, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        {user?.papel === 'admin' ? (
                          <Select
                            value={pedido.status}
                            onChange={(e) => {
                              if (e.target.value === 'rejeitado') {
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
                      <ActionButton bgColor="#c91407" onClick={() => handleDeletePedido(pedido.id)} title="Excluir pedido">
                        Excluir
                      </ActionButton>
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
