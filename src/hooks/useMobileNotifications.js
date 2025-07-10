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
    console.log('Enviando notificação móvel:', { title, body, action, permission });
    
    if (permission !== 'granted') {
      console.log('Permissão não concedida, tentando solicitar...');
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        console.log('Permissão de notificação negada');
        return false;
      }
    }

    try {
      if (isMobile() && swRegistration) {
        console.log('Usando Service Worker para notificação móvel');
        
        // Primeiro tentar Service Worker
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
            tag: `controle-estoque-mobile-${Date.now()}`,
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
        console.log('Usando Notification API padrão');
        
        // Usar Notification API padrão para desktop ou quando SW não está disponível
        const notification = new Notification(title, {
          body,
          icon: '/icon.png',
          badge: '/icon.png',
          tag: `controle-estoque-desktop-${Date.now()}`,
          data: { action },
          vibrate: isMobile() ? [200, 100, 200] : undefined,
          requireInteraction: !isMobile()
        });

        notification.onclick = () => {
          console.log('Clique na notificação:', action);
          window.focus();
          const targetUrl = action.startsWith('/') ? window.location.origin + action : action;
          window.location.href = targetUrl;
          notification.close();
        };

        // Auto-fechar após tempo determinado
        const autoCloseTime = isMobile() ? 8000 : 15000;
        setTimeout(() => notification.close(), autoCloseTime);
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      
      // Último fallback: tentar Notification API básica
      try {
        const basicNotification = new Notification(title, {
          body,
          icon: '/icon.png'
        });
        
        basicNotification.onclick = () => {
          window.focus();
          const targetUrl = action.startsWith('/') ? window.location.origin + action : action;
          window.location.href = targetUrl;
          basicNotification.close();
        };
        
        setTimeout(() => basicNotification.close(), 8000);
        return true;
      } catch (fallbackError) {
        console.error('Fallback também falhou:', fallbackError);
        return false;
      }
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
