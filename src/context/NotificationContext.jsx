import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useMobileNotifications } from '../hooks/useMobileNotifications';

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
  
  // Hook para notificações móveis
  const mobileNotifications = useMobileNotifications();

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

  // Efeito para solicitar permissão de notificação automaticamente
  useEffect(() => {
    const requestInitialPermission = async () => {
      if (mobileNotifications.isSupported && mobileNotifications.permission === 'default') {
        // Aguardar um pouco antes de solicitar para não ser intrusivo
        setTimeout(() => {
          mobileNotifications.requestPermission();
        }, 3000);
      }
    };

    requestInitialPermission();
  }, [mobileNotifications.isSupported, mobileNotifications.permission]);

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

    // Se a página não estiver em foco, enviar notificação do Windows/Mobile
    // mas com limite de tempo (não mais que 1 notificação por minuto)
    if (document.hidden) {
      const now = Date.now();
      const timeSinceLastNotification = now - lastWindowNotificationRef.current;
      
      if (timeSinceLastNotification > 60000) { // 1 minuto
        // Usar notificação móvel se disponível, senão usar padrão
        if (mobileNotifications.isMobile && mobileNotifications.isAvailable()) {
          mobileNotifications.sendNotification(notification.title, notification.body, notification.action);
        } else {
          showWindowsNotification(notification.title, notification.body, notification.action);
        }
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
        // Configurações específicas para diferentes dispositivos
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const notificationOptions = {
          body,
          icon: '/icon.png',
          badge: '/icon.png', // Para Android
          requireInteraction: !isMobile, // Em mobile, auto-fechar é melhor
          tag: 'controle-estoque',
          data: { action },
          vibrate: isMobile ? [200, 100, 200] : undefined, // Vibração apenas em mobile
          silent: false,
          renotify: true
        };

        // Para mobile, adicionar mais opções
        if (isMobile) {
          notificationOptions.actions = [
            {
              action: 'open',
              title: '📱 Abrir',
              icon: '/icon.png'
            }
          ];
        }

        const notification = new window.Notification(title, notificationOptions);

        // Handler para clique na notificação
        const handleNotificationClick = (event) => {
          console.log('Notificação clicada:', { event, action });
          
          // Focar na janela/aba do navegador
          if (window.focus) {
            window.focus();
          }
          
          // Determinar a URL de destino
          const targetAction = event.target?.data?.action || action;
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
          
          console.log('Redirecionando para:', targetUrl);
          
          // Para mobile, usar diferentes estratégias
          if (isMobile) {
            // Tentar abrir na mesma aba se possível
            if (window.location.href.includes(window.location.origin)) {
              window.location.href = targetUrl;
            } else {
              window.open(targetUrl, '_blank');
            }
          } else {
            // Desktop - verificar se a página está oculta
            if (document.hidden) {
              sessionStorage.setItem('pendingRedirect', targetUrl);
            } else {
              window.location.href = targetUrl;
            }
          }
          
          // Fechar a notificação
          notification.close();
        };

        // Adicionar listeners
        notification.onclick = handleNotificationClick;
        
        // Para mobile, também escutar ações
        if ('addEventListener' in notification && isMobile) {
          notification.addEventListener('notificationclick', handleNotificationClick);
        }

        // Auto-fechar - tempo diferente para mobile vs desktop
        const autoCloseTime = isMobile ? 8000 : 15000;
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, autoCloseTime);

      } catch (err) {
        console.debug('Erro ao exibir notificação:', err);
        
        // Fallback para mobile - tentar service worker notification
        if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
              body,
              icon: '/icon.png',
              badge: '/icon.png',
              tag: 'controle-estoque-fallback',
              data: { action },
              vibrate: [200, 100, 200],
              actions: [
                {
                  action: 'open',
                  title: 'Abrir'
                }
              ]
            });
          }).catch(swErr => {
            console.debug('Service Worker notification também falhou:', swErr);
          });
        }
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
