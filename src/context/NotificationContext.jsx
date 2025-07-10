import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastWindowNotificationRef = useRef(0);
  const notificationHistoryRef = useRef(new Set()); // Para evitar duplicatas

  // Efeito para detectar quando a página fica visível novamente
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Página ficou visível - verificar se há redirecionamento pendente
        const pendingRedirect = sessionStorage.getItem('pendingRedirect');
        if (pendingRedirect) {
          sessionStorage.removeItem('pendingRedirect');
          // Usar timeout para garantir que a página esteja totalmente carregada
          setTimeout(() => {
            window.location.href = pendingRedirect;
          }, 100);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const addNotification = (notification) => {
    // Criar chave única para evitar duplicatas
    const notificationKey = `${notification.type}_${notification.title}_${notification.body}`;
    
    // Verificar se já foi enviada nos últimos 5 minutos
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentNotifications = Array.from(notificationHistoryRef.current)
      .filter(item => {
        const [_, timestamp] = item.split('_TIMESTAMP_');
        return parseInt(timestamp) > fiveMinutesAgo;
      });
    
    // Limpar histórico antigo
    notificationHistoryRef.current = new Set(recentNotifications);
    
    // Verificar se esta notificação já foi enviada recentemente
    const isDuplicate = recentNotifications.some(item => 
      item.startsWith(notificationKey + '_TIMESTAMP_')
    );
    
    if (isDuplicate) {
      console.debug('Notificação duplicada ignorada:', notification.title);
      return;
    }

    // Adicionar ao histórico
    notificationHistoryRef.current.add(`${notificationKey}_TIMESTAMP_${Date.now()}`);

    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Máximo 50 notificações
    setUnreadCount(prev => prev + 1);

    // Se a página não estiver em foco, enviar notificação do Windows
    // mas com limite de tempo (não mais que 1 notificação por minuto)
    if (document.hidden) {
      const now = Date.now();
      const timeSinceLastNotification = now - lastWindowNotificationRef.current;
      
      if (timeSinceLastNotification > 60000) { // 1 minuto
        showWindowsNotification(notification.title, notification.body, notification.action);
        lastWindowNotificationRef.current = now;
      }
    }

    return newNotification.id;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    // Limpar histórico também
    notificationHistoryRef.current.clear();
  };

  const showWindowsNotification = (title, body, action) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new window.Notification(title, { 
          body,
          icon: '/icon.png', // Usar o ícone da pasta public
          requireInteraction: true, // Manter visível até interação
          tag: 'controle-estoque', // Evitar múltiplas notificações
          data: { action } // Passar dados para o evento
        });

        // Adicionar listener para clique na notificação
        notification.onclick = (event) => {
          // Focar na janela/aba do navegador
          window.focus();
          
          // Determinar a URL de destino
          const targetAction = event.target.data?.action || action;
          let targetUrl;
          
          if (targetAction) {
            // Se é uma rota relativa, construir URL completa
            if (targetAction.startsWith('/')) {
              targetUrl = window.location.origin + targetAction;
            } else {
              targetUrl = targetAction;
            }
          } else {
            // Se não há ação específica, ir para o dashboard
            targetUrl = window.location.origin + '/dashboard';
          }
          
          // Verificar se a página atual é a mesma que queremos abrir
          if (window.location.href === targetUrl) {
            // Já estamos na página correta, apenas fechar notificação
            notification.close();
            return;
          }
          
          // Se a página está oculta ou minimizada, agendar redirecionamento
          if (document.hidden) {
            sessionStorage.setItem('pendingRedirect', targetUrl);
          } else {
            // Página está visível, redirecionar imediatamente
            window.location.href = targetUrl;
          }
          
          // Fechar a notificação
          notification.close();
        };

        // Auto-fechar após 15 segundos se não houver interação
        setTimeout(() => {
          notification.close();
        }, 15000);

      } catch (err) {
        console.debug('Erro ao exibir notificação do Windows:', err);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
