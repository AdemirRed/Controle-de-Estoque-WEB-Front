/* eslint-disable no-unused-vars */
import {
  Alert, Button, Dialog, FormControl, IconButton,
  InputLabel,
  MenuItem, Paper,
  Select, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaBars, FaEdit, FaEye, FaTimes, FaWhatsapp, FaWindowClose } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import FiltrosPadrao from '../../components/FiltrosPadrao';
import Header from '../../components/Header';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import { PedidoService } from '../../services/pedidoService';
import {
  ButtonContainer,
  Container,
  DetailsContainer, DetailsHeader,
  DetailsLabel,
  DetailsRow,
  DetailsValue,
  FormContainer,
  FormWrapper
} from './styles';

function showBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Função global para buscar pedidos pendentes e notificar
function startPedidosPolling(PedidoService, user) {
  let lastPendingCount = 0;
  setInterval(async () => {
    try {
      if (!user || user.papel !== 'admin') return;
      const response = await PedidoService.listarPedidos();
      const pedidos = response.data || [];
      const pendentes = pedidos.filter(p => p.status === 'pendente');
      if (pendentes.length > lastPendingCount) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(
            'Novo pedido pendente!',
            { body: `Você tem ${pendentes.length} pedido(s) pendente(s) para aprovar.` }
          );
        }
      }
      lastPendingCount = pendentes.length;
    } catch (error) {
      // Silencie erros de polling
    }
  }, 180000); // 3 minutos
}

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { user, signOut } = useAuth();
  const [modo, setModo] = useState('criar');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const location = useLocation();
  const [lastPendingCount, setLastPendingCount] = useState(0);
  
  // Estados para o formulário
  const [itens, setItens] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [formData, setFormData] = useState({
    item_id: '',
    item_nome: '',
    item_descricao: '',
    quantidade: '',
    item_unidade_medida_id: '',
    observacoes: ''
  });

  const [statusDialog, setStatusDialog] = useState({
    open: false,
    pedidoId: null,
    novoStatus: '',
  });
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorId, setFornecedorId] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  // Filtros de busca
  const [busca, setBusca] = useState('');
  const [buscaPeriodo, setBuscaPeriodo] = useState([null, null]);
  const [statusFiltro, setStatusFiltro] = useState('todos');

  useEffect(() => {
    carregarPedidos();
    carregarItens();
    carregarUnidadesMedida();
  }, []);

  useEffect(() => {
    if (modo === 'editar' && selectedPedido) {
      setFormData({
        item_id: selectedPedido.item_id || '',
        // Ajuste aqui: pega o nome do item do objeto Item, se existir, senão do campo item_nome
        item_nome: selectedPedido.Item?.nome || selectedPedido.item_nome || '',
        item_descricao: selectedPedido.Item?.descricao || selectedPedido.item_descricao || '',
        quantidade: selectedPedido.quantidade || '',
        item_unidade_medida_id: selectedPedido.unidade_medida?.id || selectedPedido.item_unidade_medida_id || '',
        observacoes: selectedPedido.observacoes || ''
      });
    }
  }, [modo, selectedPedido]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fecha o menu lateral ao trocar de rota em telas pequenas
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
     
  }, [location.pathname]);

  useEffect(() => {
    // Sempre que pedidos mudar, verifica se há novos pendentes (apenas admin)
    if (user?.papel === 'admin') {
      const pendentes = pedidos.filter(p => p.status === 'pendente');
      if (pendentes.length > lastPendingCount) {
        showBrowserNotification(
          'Novo pedido pendente!',
          `Você tem ${pendentes.length} pedido(s) pendente(s) para aprovar.`
        );
      }
      setLastPendingCount(pendentes.length);
    }
  }, [pedidos, user]); // Inclua user na dependência

  useEffect(() => {
    // Inicia o polling global apenas uma vez e só para admin
    if (user?.papel === 'admin' && window.__pedidosPollingStarted !== true) {
      window.__pedidosPollingStarted = true;
      startPedidosPolling(PedidoService, user);
    }
     
  }, [user]);

  // Fecha o menu lateral ao navegar em telas pequenas
  const handleSidebarNavigate = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  const carregarPedidos = async () => {
    try {
      const response = await PedidoService.listarPedidos();
      setPedidos(response.data);
    } catch (error) {
      showNotification('Erro ao carregar pedidos', 'error');
    }
  };

  const carregarItens = async () => {
    try {
      const response = await PedidoService.listarItens();
      setItens(response.data);
    } catch (error) {
      showNotification('Erro ao carregar itens', 'error');
    }
  };

  const carregarUnidadesMedida = async () => {
    try {
      const response = await PedidoService.listarUnidadesMedida();
      setUnidadesMedida(response.data);
    } catch (error) {
      showNotification('Erro ao carregar unidades de medida', 'error');
    }
  };

  const carregarFornecedores = async () => {
    try {
      const response = await PedidoService.listarFornecedores();
      setFornecedores(response.data);
    } catch (error) {
      showNotification('Erro ao carregar fornecedores', 'error');
    }
  };

  const handleStatusChange = async (pedidoId, novoStatus) => {
    if (novoStatus === 'aprovado') {
      await carregarFornecedores();
      setFornecedorId('');
      setStatusDialog({ open: true, pedidoId, novoStatus });
      return;
    }
    if (novoStatus === 'rejeitado') {
      setMotivoRejeicao('');
      setStatusDialog({ open: true, pedidoId, novoStatus });
      return;
    }
    // Para pendente/entregue, atualiza direto
    try {
      await PedidoService.atualizarPedido(pedidoId, { status: novoStatus });
      await carregarPedidos();
      showNotification('Status atualizado com sucesso!');
    } catch (error) {
      showNotification(error.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleStatusDialogSubmit = async (e) => {
    e.preventDefault();
    const { pedidoId, novoStatus } = statusDialog;
    let body = { status: novoStatus };
    if (novoStatus === 'aprovado') {
      if (!fornecedorId) {
        showNotification('Selecione um fornecedor', 'error');
        return;
      }
      body.fornecedor_id = fornecedorId;
    }
    if (novoStatus === 'rejeitado') {
      if (!motivoRejeicao.trim()) {
        showNotification('Informe o motivo da rejeição', 'error');
        return;
      }
      body.motivo_rejeicao = motivoRejeicao.trim();
    }
    try {
      await PedidoService.atualizarPedido(pedidoId, body);
      await carregarPedidos();
      showNotification('Status atualizado com sucesso!');
      setStatusDialog({ open: false, pedidoId: null, novoStatus: '' });
      setFornecedorId('');
      setMotivoRejeicao('');
    } catch (error) {
      showNotification(error.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modo === 'criar') {
        await PedidoService.criarPedido(formData);
        showNotification('Pedido criado com sucesso!');
      } else {
        await PedidoService.atualizarPedido(selectedPedido.id, formData);
        showNotification('Pedido atualizado com sucesso!');
      }
      setOpenForm(false);
      carregarPedidos();
      limparFormulario();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Erro ao processar pedido', 'error');
    }
  };

  const limparFormulario = () => {
    setFormData({
      item_id: '',
      item_nome: '',
      item_descricao: '',
      quantidade: '',
      item_unidade_medida_id: '',
      observacoes: ''
    });
    setSelectedPedido(null);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente': '#ffa000',
      'aprovado': '#2196f3',
      'rejeitado': '#f44336',
      'entregue': '#4caf50'
    };
    return colors[status] || '#757575';
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtro dos pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    // Filtro por número (últimos 6 dígitos do id) ou nome do item
    const numeroPedido = pedido.id.slice(-6).toUpperCase();
    const nomeItem = (pedido.Item?.nome || pedido.item_nome || '').toLowerCase();
    const buscaLower = busca.trim().toLowerCase();
    const buscaOk =
      !buscaLower ||
      numeroPedido.includes(buscaLower.toUpperCase()) ||
      nomeItem.includes(buscaLower);

    // Filtro por período (intervalo de datas)
    let buscaDataOk = true;
    if (buscaPeriodo[0] && buscaPeriodo[1]) {
      const dataPedido = pedido.data_pedido ? new Date(pedido.data_pedido) : null;
      if (dataPedido) {
        dataPedido.setHours(0, 0, 0, 0);
        buscaDataOk =
          dataPedido.getTime() >= buscaPeriodo[0].setHours(0, 0, 0, 0) &&
          dataPedido.getTime() <= buscaPeriodo[1].setHours(0, 0, 0, 0);
      } else {
        buscaDataOk = false;
      }
    }

    // Filtro por status
    const statusOk = statusFiltro === 'todos' || pedido.status === statusFiltro;

    return buscaOk && buscaDataOk && statusOk;
  });

  // Funções rápidas para selecionar períodos
  const handlePeriodoHoje = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    setBuscaPeriodo([hoje, hoje]);
  };
  const handlePeriodoSemana = () => {
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    setBuscaPeriodo([inicio, fim]);
  };
  const handlePeriodoMes = () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    setBuscaPeriodo([inicio, fim]);
  };

  // Função para detectar se é mobile
  const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  // Adicione o estado para controlar o pedido a ser excluído
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState(null);

  // Função para excluir pedido
  const handleDeletePedido = async (pedidoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;
    try {
      await PedidoService.excluirPedido(pedidoId);
      showNotification('Pedido excluído com sucesso!');
      carregarPedidos();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Erro ao excluir pedido', 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--dark-bg)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: 0
      }}>
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
            <FaBars />
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
                <FaTimes />
              </button>
              <MenuSidebar onNavigate={handleSidebarNavigate} />
            </div>
          </>
        )}
        {/* Header ao lado do menu */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Header title="Pedidos" user={user} onLogout={signOut} />
          <Container style={{
            width: '100%',
            marginLeft: sidebarOpen ? 0 : 0,
            transition: 'margin 0.3s'
          }}>
            <Button
              variant="contained"
              onClick={() => {
                setModo('criar');
                limparFormulario();
                setOpenForm(true);
              }}
              sx={{
                mb: 2,
                background: 'var(--gradient-blue)',
                '&:hover': { opacity: 0.9 }
              }}
            >
              Novo Pedido
            </Button>

            {/* Filtros de busca organizados */}
            <FiltrosPadrao
              busca={busca}
              setBusca={setBusca}
              buscaPeriodo={buscaPeriodo}
              setBuscaPeriodo={setBuscaPeriodo}
              statusFiltro={statusFiltro}
              setStatusFiltro={setStatusFiltro}
              exibirStatus={true}
              onLimpar={() => {
                setBusca('');
                setBuscaPeriodo([null, null]);
                setStatusFiltro('todos');
              }}
              onHoje={handlePeriodoHoje}
              onSemana={handlePeriodoSemana}
              onMes={handlePeriodoMes}
            />
            {/* Tabela de Pedidos */}
            <TableContainer component={Paper} sx={{ backgroundColor: 'var(--dark-surface)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Nº</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Item</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Quantidade</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Data</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidosFiltrados.map((pedido, idx) => {
                    // Nome do item: se existir Item.nome, usa ele, senão usa item_nome
                    const nomeItem = pedido.Item?.nome || pedido.item_nome || '-';
                    // Unidade de medida: se existir unidade_medida.sigla, usa ela, senão usa vazio
                    const siglaUnidade = pedido.unidade_medida?.sigla || '';
                    // Novo número do pedido: últimos 6 dígitos do ID
                    const numeroPedido = pedido.id.slice(-6).toUpperCase();
                    return (
                      <TableRow key={pedido.id}>
                        <TableCell sx={{ color: '#fff' }}>{numeroPedido}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{nomeItem}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>
                          {pedido.quantidade} {siglaUnidade}
                        </TableCell>
                        <TableCell sx={{ color: '#fff' }}>{formatarData(pedido.data_pedido)}</TableCell>
                        <TableCell>
                          {user?.papel === 'admin' ? (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={pedido.status}
                                onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                                sx={{
                                  color: getStatusColor(pedido.status),
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: getStatusColor(pedido.status)
                                  }
                                }}
                              >
                                <MenuItem value="pendente">Pendente</MenuItem>
                                <MenuItem value="aprovado">Aprovado</MenuItem>
                                <MenuItem value="rejeitado">Rejeitado</MenuItem>
                                <MenuItem value="entregue">Entregue</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <span style={{ color: getStatusColor(pedido.status), fontWeight: 600 }}>
                              {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={async () => {
                              setSelectedPedido(pedido);
                              setModo('editar');
                              setOpenForm(true);
                            }}
                            sx={{ color: '#00f2fa' }}
                          >
                            <FaEdit />
                          </IconButton>
                          <IconButton 
                            onClick={() => {
                              setSelectedPedido(pedido);
                              setOpenDetails(true);
                            }}
                            sx={{ color: '#fff' }}
                          >
                            <FaEye />
                          </IconButton>
                          {/* Só admin pode enviar no WhatsApp e só se não for rejeitado nem pendente */}
                          {user?.papel === 'admin' && pedido.status !== 'rejeitado' && pedido.status !== 'pendente' && (
                            <IconButton
                              onClick={async () => {
                                // Novo número do pedido: últimos 6 dígitos do ID
                                const numeroPedido = pedido.id.slice(-6).toUpperCase();
                                const solicitante = user?.nome || 'Solicitante';
                                const unidade = pedido.unidade_medida?.nome || '';
                                const observacao = pedido.observacoes || '-';

                                let telefone = '';
                                let fornecedorId = pedido.Fornecedor?.id || pedido.fornecedor_id;

                                // Tenta pegar do objeto Fornecedor do pedido
                                if (pedido.Fornecedor && typeof pedido.Fornecedor.telefone === 'string') {
                                  telefone = pedido.Fornecedor.telefone.replace(/\D/g, '');
                                }
                                // Se não, tenta pegar do array de fornecedores carregado (usado no Select)
                                else if (fornecedorId) {
                                  const fornecedorObj = fornecedores.find(f => f.id === fornecedorId);
                                  if (fornecedorObj && fornecedorObj.telefone) {
                                    telefone = fornecedorObj.telefone.replace(/\D/g, '');
                                  }
                                }

                                // Adicione este log para depuração:
                                console.log('FornecedorId:', fornecedorId, 'Telefone extraído:', telefone);

                                if (!telefone) {
                                  showNotification('Telefone do fornecedor não disponível. Atualize o cadastro do fornecedor.', 'error');
                                  return;
                                }

                                // Ajuste: Remover o 9 após o DDD se o número tiver 9 dígitos e começar com 9
                                // Exemplo: +55 (51) 997756708 => 5551997756708
                                // Para WhatsApp: 5551977756708 (remove o 9 após o DDD)
                                let telefoneWhatsapp = telefone;
                                if (telefoneWhatsapp.length === 13 && telefoneWhatsapp.startsWith('55')) {
                                  // 55 + DDD(2) + 9 + número(8)
                                  telefoneWhatsapp = telefoneWhatsapp.slice(0, 4) + telefoneWhatsapp.slice(5);
                                }

                                const mensagem = 
`🔔 *Solicitação de Pedido* 🔔

Olá! Esperamos que esteja bem. Seguem os detalhes do novo pedido para seu atendimento:

📝 *Número do Pedido:* ${numeroPedido}
📦 *Item:* ${nomeItem}
🔢 *Quantidade:* ${pedido.quantidade}
📏 *Unidade:* ${unidade}
🗒️ *Observações:* ${observacao}

👤 *Solicitante:* ${solicitante}

📍 *Endereço para entrega:*
R. Arno Wickert, 44 - Industrial, Dois Irmãos - RS, 93950-000
https://maps.app.goo.gl/cPVRLrGF4vZkxEqh7

Agradecemos pela parceria e aguardamos a confirmação do recebimento deste pedido. Qualquer dúvida, estamos à disposição! 🤝

Atenciosamente,
Equipe ⚪ OnnMoveis 🔵

> Feito por _RedBlack_
`;
                                // Detecta se é mobile ou desktop e monta o link correto
                                const link = isMobile()
                                  ? `https://api.whatsapp.com/send?phone=${telefoneWhatsapp}&text=${encodeURIComponent(mensagem)}`
                                  : `https://web.whatsapp.com/send?phone=${telefoneWhatsapp}&text=${encodeURIComponent(mensagem)}`;
                                window.open(link);
                              }}
                              sx={{ color: '#25D366' }}
                            >
                              <FaWhatsapp />
                            </IconButton>
                          )}
                          {/* Botão de excluir para admin */}
                          {user?.papel === 'admin' && (
                            <IconButton
                              onClick={() => handleDeletePedido(pedido.id)}
                              sx={{ color: '#f44336' }}
                              title="Excluir pedido"
                            >
                              <FaTimes />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Dialog do Formulário */}
            <Dialog 
              open={openForm} 
              onClose={() => setOpenForm(false)}
              maxWidth="md"
              fullWidth
            >
              <FormWrapper>
                <FormContainer onSubmit={handleSubmit}>
                  <h2>{modo === 'criar' ? 'Novo Pedido' : 'Editar Pedido'}</h2>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: '#fff' }}>Item</InputLabel>
                    <Select
                      value={formData.item_id}
                      onChange={(e) => {
                        const item = itens.find(i => i.id === e.target.value);
                        setFormData({
                          ...formData,
                          item_id: e.target.value,
                          item_nome: item?.nome || '',
                          item_unidade_medida_id: item?.unidade_medida_id || ''
                        });
                      }}
                      sx={{ color: '#fff' }}
                    >
                      {itens.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Nome do Item"
                    value={formData.item_nome}
                    onChange={(e) => setFormData({ ...formData, item_nome: e.target.value })}
                    fullWidth
                    margin="normal"
                    sx={{ input: { color: '#ffffff' }, label: { color: '#fff' } }}
                    disabled={!!formData.item_id}
                  />

                  <TextField
                    label="Quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    fullWidth
                    margin="normal"
                    sx={{ input: { color: '#fff' }, label: { color: '#fff' } }}
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: '#fff' }}>Unidade de Medida</InputLabel>
                    <Select
                      value={formData.item_unidade_medida_id}
                      onChange={(e) => setFormData({ ...formData, item_unidade_medida_id: e.target.value })}
                      sx={{ color: '#fff' }}
                    >
                      {unidadesMedida.map(unidade => (
                        <MenuItem key={unidade.id} value={unidade.id}>
                          {unidade.nome} ({unidade.sigla})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Observações"
                    multiline
                    rows={4}
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    fullWidth
                    margin="normal"
                    sx={{ input: { color: '#fff' }, label: { color: '#fff' } }}
                  />

                  <ButtonContainer>
                    <Button type="submit" variant="contained" color="primary">
                      {modo === 'criar' ? 'Criar Pedido' : 'Salvar Alterações'}
                    </Button>
                    <Button variant="outlined" onClick={() => setOpenForm(false)}>
                      Cancelar
                    </Button>
                  </ButtonContainer>
                </FormContainer>
              </FormWrapper>
            </Dialog>

            {/* Dialog de Detalhes */}
            <Dialog 
              open={openDetails} 
              onClose={() => setOpenDetails(false)}
              maxWidth="md"
              fullWidth
            >
              {selectedPedido && (
                <DetailsContainer>
                  <DetailsHeader>
                    Detalhes do Pedido #{selectedPedido.id.substring(0, 8)}
                  </DetailsHeader>


                  <DetailsRow>
                    <DetailsLabel>Item:</DetailsLabel>
                    <DetailsValue>
                      {selectedPedido.Item?.nome || selectedPedido.item_nome || '-'}
                    </DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Descrição do Item:</DetailsLabel>
                    <DetailsValue>
                      {selectedPedido.Item?.descricao || selectedPedido.item_descricao || '-'}
                    </DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Quantidade:</DetailsLabel>
                    <DetailsValue>
                      {selectedPedido.quantidade} {selectedPedido.unidade_medida?.sigla || ''}
                    </DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Unidade de Medida:</DetailsLabel>
                    <DetailsValue>
                      {selectedPedido.unidade_medida?.nome
                        ? `${selectedPedido.unidade_medida.nome} (${selectedPedido.unidade_medida.sigla})`
                        : '-'}
                    </DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Status:</DetailsLabel>
                    <DetailsValue>{selectedPedido.status}</DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Motivo da Rejeição:</DetailsLabel>
                    <DetailsValue>{selectedPedido.motivo_rejeicao || '-'}</DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Data do Pedido:</DetailsLabel>
                    <DetailsValue>{formatarData(selectedPedido.data_pedido)}</DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Observações:</DetailsLabel>
                    <DetailsValue>{selectedPedido.observacoes || '-'}</DetailsValue>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsLabel>Fornecedor:</DetailsLabel>
                    <DetailsValue>
                      {selectedPedido.Fornecedor?.nome ||
                        selectedPedido.fornecedor?.nome ||
                        selectedPedido.fornecedor_nome ||
                        '-'}
                    </DetailsValue>
                  </DetailsRow>

                  

                  <ButtonContainer>
                    <Button 
                      variant="contained" 
                      onClick={() => setOpenDetails(false)}
                      startIcon={<FaWindowClose />}
                    >
                      Fechar
                    </Button>
                  </ButtonContainer>
                </DetailsContainer>
              )}
            </Dialog>

            {/* Dialog para status aprovado/rejeitado */}
            <Dialog
              open={statusDialog.open}
              onClose={() => setStatusDialog({ open: false, pedidoId: null, novoStatus: '' })}
              maxWidth="xs"
              fullWidth
            >
              <FormWrapper>
                <form onSubmit={handleStatusDialogSubmit}>
                  <h3>
                    {statusDialog.novoStatus === 'aprovado'
                      ? 'Aprovar Pedido'
                      : 'Rejeitar Pedido'}
                  </h3>
                  {statusDialog.novoStatus === 'aprovado' && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ color: '#fff' }}>Fornecedor</InputLabel>
                      <Select
                        value={fornecedorId}
                        onChange={e => setFornecedorId(e.target.value)}
                        sx={{ color: '#fff' }}
                        required
                      >
                        {fornecedores.map(f => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.nome} {f.telefone ? `- ${f.telefone}` : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {statusDialog.novoStatus === 'rejeitado' && (
                    <TextField
                      label="Motivo da Rejeição"
                      value={motivoRejeicao}
                      onChange={e => setMotivoRejeicao(e.target.value)}
                      fullWidth
                      margin="normal"
                      required
                      sx={{ input: { color: '#fff' }, label: { color: '#fff' } }}
                    />
                  )}
                  <ButtonContainer>
                    <Button type="submit" variant="contained" color="primary">
                      Confirmar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setStatusDialog({ open: false, pedidoId: null, novoStatus: '' })}
                    >
                      Cancelar
                    </Button>
                  </ButtonContainer>
                </form>
              </FormWrapper>
            </Dialog>

            {/* Notificações */}
            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={handleCloseNotification}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert
                onClose={handleCloseNotification}
                severity={notification.severity}
                sx={{ width: '100%' }}
              >
                {notification.message}
              </Alert>
            </Snackbar>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
