import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../services/api';
import { PedidoService } from '../../services/pedidoService';

// Função para solicitar permissão de notificação
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        toast.success('Notificações ativadas!');
      }
    });
  }
}

// Utilitário para persistir notificações visualizadas
function getViewedNotifications() {
  try {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '{}');
  } catch {
    return {};
  }
}
function setViewedNotification(key) {
  const viewed = getViewedNotifications();
  viewed[key] = true;
  localStorage.setItem('viewedNotifications', JSON.stringify(viewed));
}
function isNotificationViewed(key) {
  const viewed = getViewedNotifications();
  return !!viewed[key];
}

const NotificationListener = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const lastCountsRef = useRef({
    pedidosPendentes: 0,
    requisicoesPendentes: 0
  });
  const lastUserPedidosRef = useRef(new Map()); // Map para armazenar último status dos pedidos do usuário
  const intervalRef = useRef(null);

  // Adicione refs para lembrar o último lembrete
  const lastReminderRef = useRef({
    pedidos: 0,
    requisicoes: 0
  });
  // Defina o intervalo de lembrete em ms (ex: 30 minutos)
  const REMINDER_INTERVAL = 30 * 60 * 1000;

  useEffect(() => {
    // Solicitar permissão de notificação ao carregar o componente
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Função para verificar atualizações
    const checkForUpdates = async () => {
      try {
        // Para ADMIN: Verificar novos pedidos e requisições pendentes
        if (user.papel === 'admin') {
          // Buscar pedidos pendentes igual ao Dashboard
          const pedidosPendentesRes = await api.get('/pedidos?status=pendente');
          let pedidosPendentesTotal = 0;
          if (Array.isArray(pedidosPendentesRes.data)) {
            pedidosPendentesTotal = pedidosPendentesRes.data.length;
          } else if (typeof pedidosPendentesRes.data?.total === 'number') {
            pedidosPendentesTotal = pedidosPendentesRes.data.total;
          } else if (Array.isArray(pedidosPendentesRes.data?.pedidos)) {
            pedidosPendentesTotal = pedidosPendentesRes.data.pedidos.length;
          }

          // Buscar requisições de itens pendentes
          const requisicaoRes = await api.get('/item-requests');
          const requisicoesPendentes = requisicaoRes.data?.filter(r => r.status === 'pendente') || [];
          const requisicoesPendentesTotal = requisicoesPendentes.length;

          const now = Date.now();

          // Notificação de pedidos pendentes
          if (
            pedidosPendentesTotal > 0 &&
            (lastCountsRef.current.pedidosPendentes === 0 ||
              pedidosPendentesTotal > lastCountsRef.current.pedidosPendentes)
          ) {
            addNotification({
              title: 'Pedidos pendentes!',
              body: `Você tem ${pedidosPendentesTotal} pedido(s) pendente(s) para aprovar.`,
              message: `Você tem ${pedidosPendentesTotal} pedido(s) pendente(s) para aprovar.`,
              type: 'pedidos',
              action: '/pedidos'
            });
            lastReminderRef.current.pedidos = now;
          } else if (
            pedidosPendentesTotal > 0 &&
            now - lastReminderRef.current.pedidos > REMINDER_INTERVAL
          ) {
            addNotification({
              title: 'Lembrete: pedidos pendentes!',
              body: `Ainda há ${pedidosPendentesTotal} pedido(s) pendente(s) para aprovar.`,
              message: `Ainda há ${pedidosPendentesTotal} pedido(s) pendente(s) para aprovar.`,
              type: 'pedidos',
              action: '/pedidos'
            });
            lastReminderRef.current.pedidos = now;
          }

          // Notificação de requisições de itens pendentes
          if (
            requisicoesPendentesTotal > 0 &&
            (lastCountsRef.current.requisicoesPendentes === 0 ||
              requisicoesPendentesTotal > lastCountsRef.current.requisicoesPendentes)
          ) {
            addNotification({
              title: 'Requisições de itens pendentes!',
              body: `Você tem ${requisicoesPendentesTotal} requisição(ões) de item pendente(s) para aprovar.`,
              message: `Você tem ${requisicoesPendentesTotal} requisição(ões) de item pendente(s) para aprovar.`,
              type: 'requisicoes',
              action: '/item-requests'
            });
            lastReminderRef.current.requisicoes = now;
          } else if (
            requisicoesPendentesTotal > 0 &&
            now - lastReminderRef.current.requisicoes > REMINDER_INTERVAL
          ) {
            addNotification({
              title: 'Lembrete: requisições de itens pendentes!',
              body: `Ainda há ${requisicoesPendentesTotal} requisição(ões) de item pendente(s) para aprovar.`,
              message: `Ainda há ${requisicoesPendentesTotal} requisição(ões) de item pendente(s) para aprovar.`,
              type: 'requisicoes',
              action: '/item-requests'
            });
            lastReminderRef.current.requisicoes = now;
          }

          // Atualizar contadores para admin
          lastCountsRef.current = {
            pedidosPendentes: pedidosPendentesTotal,
            requisicoesPendentes: requisicoesPendentesTotal
          };
        }

        // Para USUÁRIOS: Verificar mudanças de status em seus próprios pedidos
        if (user.papel !== 'admin') {
          // Buscar pedidos do usuário atual
          const pedidosRes = await PedidoService.listarPedidos();
          // Agora filtra pelo nome do usuário no campo criado_por
          const meusPedidos = pedidosRes.data?.filter(p =>
            (p.criado_por && (p.criado_por === user.nome || p.criado_por === user.email))
          ) || [];

          // Verificar mudanças de status
          meusPedidos.forEach(pedido => {
            const lastStatus = lastUserPedidosRef.current.get(pedido.id);
            const notifKey = `pedido-${pedido.id}-${pedido.status}`;

            // Notificar se for a primeira vez (lastStatus === undefined) ou se mudou o status
            if ((lastStatus === undefined || lastStatus !== pedido.status) && !isNotificationViewed(notifKey)) {
              const statusLabels = {
                pendente: 'Pendente',
                aprovado: 'Aprovado',
                rejeitado: 'Rejeitado',
                entregue: 'Entregue'
              };

              const itemNome = pedido.item_nome || pedido.item_id || 'Item';

              let bodyMsg = `Seu pedido de ${itemNome} foi ${statusLabels[pedido.status]?.toLowerCase() || pedido.status}.`;
              // Se for rejeitado, incluir motivo
              if (pedido.status === 'rejeitado' && (pedido.motivo_recusa || pedido.motivo_rejeicao)) {
                bodyMsg += ` Motivo: ${pedido.motivo_recusa || pedido.motivo_rejeicao}`;
              }

              addNotification({
                title: `Pedido ${statusLabels[pedido.status] || pedido.status}`,
                body: bodyMsg,
                type: 'pedido_status',
                action: `/pedidos?highlight=${pedido.id}` // Adicionar parâmetro para destacar o pedido específico
              });
              setViewedNotification(notifKey);
            }

            // Atualizar último status conhecido
            lastUserPedidosRef.current.set(pedido.id, pedido.status);
          });

          // Notificações para requisições de itens (usando solicitante)
          try {
            const requisicoesRes = await api.get('/item-requests');
            const minhasRequisicoes = requisicoesRes.data?.filter(r =>
              (r.solicitante && (r.solicitante === user.nome || r.solicitante === user.email)) ||
              (r.usuario && (r.usuario.nome === user.nome || r.usuario.email === user.email)) ||
              (r.usuario_id && r.usuario_id === user.id) ||
              (r.requisitante_id && r.requisitante_id === user.id)
            ) || [];

            // Use um Map separado para requisições se quiser evitar conflitos
            if (!NotificationListener.lastUserRequisicoesRef) {
              NotificationListener.lastUserRequisicoesRef = new Map();
            }
            const lastUserRequisicoesRef = NotificationListener.lastUserRequisicoesRef;

            minhasRequisicoes.forEach(req => {
              const lastStatus = lastUserRequisicoesRef.get(req.id);
              const notifKey = `requisicao-${req.id}-${req.status}`;

              if ((lastStatus === undefined || lastStatus !== req.status) && !isNotificationViewed(notifKey)) {
                const statusLabels = {
                  pendente: 'Pendente',
                  aprovado: 'Aprovado',
                  rejeitado: 'Rejeitado',
                  cancelado: 'Cancelado'
                };

                let bodyMsg = `Sua requisição de item foi ${statusLabels[req.status]?.toLowerCase() || req.status}.`;
                // Mostra motivo se rejeitado
                if (req.status === 'rejeitado' && (req.motivo_rejeicao || req.motivo_recusa)) {
                  bodyMsg += ` Motivo: ${req.motivo_rejeicao || req.motivo_recusa}`;
                }

                addNotification({
                  title: `Requisição ${statusLabels[req.status] || req.status}`,
                  body: bodyMsg,
                  type: 'requisicao_status',
                  action: `/item-requests?highlight=${req.id}` // Adicionar parâmetro para destacar a requisição específica
                });
                setViewedNotification(notifKey);
              }

              lastUserRequisicoesRef.set(req.id, req.status);
            });
          } catch {
            // Silencie erros de polling de requisições
          }
        }

      } catch (error) {
        // Silenciar erros de polling para não poluir o console
        console.debug('Erro no polling de notificações:', error);
      }
    };

    // Executar verificação inicial
    checkForUpdates();

    // Configurar polling baseado no tipo de usuário
    const pollingInterval = user.papel === 'admin' ? 5000 : 15000; // Admin: 5s, User: 15s
    intervalRef.current = setInterval(checkForUpdates, pollingInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, addNotification, REMINDER_INTERVAL]);

  // Componente não renderiza nada visualmente
  return null;
};

export default NotificationListener;
