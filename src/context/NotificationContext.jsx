import React, { createContext, useContext, useState, useRef } from 'react';

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
        showWindowsNotification(notification.title, notification.body);
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

  const showWindowsNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new window.Notification(title, { body });
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
