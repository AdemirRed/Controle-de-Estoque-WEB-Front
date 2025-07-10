import { useEffect, useState } from 'react';

export const useMobileNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [swRegistration, setSwRegistration] = useState(null);

  // Detectar se é dispositivo móvel
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Inicializar service worker
  useEffect(() => {
    const initServiceWorker = async () => {
      if ('serviceWorker' in navigator && 'Notification' in window) {
        try {
          const registration = await navigator.serviceWorker.register('/sw-notifications.js');
          console.log('Service Worker registrado:', registration);
          setSwRegistration(registration);
          setIsSupported(true);
          
          // Verificar permissão atual
          setPermission(Notification.permission);
          
        } catch (error) {
          console.error('Erro ao registrar Service Worker:', error);
        }
      }
    };

    initServiceWorker();
  }, []);

  // Solicitar permissão para notificações
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return 'denied';
    }

    let result = Notification.permission;

    if (result === 'default') {
      result = await Notification.requestPermission();
    }

    setPermission(result);
    return result;
  };

  // Enviar notificação
  const sendNotification = async (title, body, action = '/dashboard') => {
    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        console.log('Permissão de notificação negada');
        return false;
      }
    }

    try {
      if (isMobile() && swRegistration) {
        // Usar Service Worker para dispositivos móveis
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            body,
            action
          });
        } else {
          // Fallback: usar registration diretamente
          await swRegistration.showNotification(title, {
            body,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: 'controle-estoque-mobile',
            data: { action },
            vibrate: [200, 100, 200],
            requireInteraction: false,
            actions: [
              {
                action: 'open',
                title: '📱 Abrir'
              }
            ]
          });
        }
      } else {
        // Usar Notification API padrão para desktop
        const notification = new Notification(title, {
          body,
          icon: '/icon.png',
          tag: 'controle-estoque-desktop',
          data: { action }
        });

        notification.onclick = () => {
          window.focus();
          const targetUrl = action.startsWith('/') ? window.location.origin + action : action;
          window.location.href = targetUrl;
          notification.close();
        };

        // Auto-fechar após 8 segundos
        setTimeout(() => notification.close(), 8000);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  };

  // Verificar se está disponível para notificações
  const isAvailable = () => {
    return isSupported && permission === 'granted';
  };

  return {
    isSupported,
    permission,
    isMobile: isMobile(),
    swRegistration,
    requestPermission,
    sendNotification,
    isAvailable
  };
};
