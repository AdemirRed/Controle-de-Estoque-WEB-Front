import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaBell, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNotifications } from '../../context/NotificationContext';
import NotificationListener from '../NotificationListener'; // Adicione esta linha
import { Header, LogoutButton, NotificationBadge, NotificationPanel, UserInfo } from './styles';

const HeaderComponent = ({ title, user, onLogout }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action);
    }
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearNotifications();
    setShowNotifications(false);
  };

  // Função de teste para disparar notificação manualmente
  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Notificação de teste', {
        body: 'Se você está vendo esta mensagem, as notificações estão funcionando!'
      });
    } else {
      toast.info('Permissão de notificação não concedida.');
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      console.log('Permissão de notificação atual:', Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Permissão de notificação após solicitação:', permission);
        });
      }
    }
  }, []);

  // Fechar painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <Header>
      <NotificationListener /> {/* Adicione aqui, antes do conteúdo visual */}
      <h1>{title}</h1>
      <UserInfo>
        {/* Botão temporário para testar notificação */}
        <Button
          variant="outlined"
          size="small"
          style={{ marginRight: 12 }}
          onClick={handleTestNotification}
        >
          Testar Notificação
        </Button>
        
        {/* Mostrar sininho para todos os usuários logados */}
        {user && (
          <div className="notification-container" style={{ position: 'relative' }}>
            <NotificationBadge 
              count={unreadCount > 0 ? unreadCount : null} 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell size={20} />
            </NotificationBadge>

            {showNotifications && (
              <NotificationPanel>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '1px solid #00eaff33',
                  paddingBottom: '8px'
                }}>
                  <h4 style={{ margin: 0, color: '#00eaff' }}>Notificações</h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#00eaff',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                {notifications.length > 0 && (
                  <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleMarkAllAsRead}
                      style={{
                        background: '#388e3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Marcar todas como lidas
                    </button>
                    <button
                      onClick={handleClearAll}
                      style={{
                        background: '#c91407',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Limpar todas
                    </button>
                  </div>
                )}

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#b2bac2', 
                      padding: '20px',
                      fontStyle: 'italic'
                    }}>
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className="notification-item"
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          backgroundColor: notification.read ? 'transparent' : '#00eaff11',
                          borderLeft: notification.read ? 'none' : '3px solid #00eaff',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <strong style={{ 
                            color: '#00eaff', 
                            fontSize: '14px',
                            fontWeight: notification.read ? 'normal' : 'bold'
                          }}>
                            {notification.title}
                          </strong>
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#b2bac2',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px'
                          }}>
                            {notification.timestamp
                              ? (notification.timestamp instanceof Date
                                  ? notification.timestamp.toLocaleString('pt-BR')
                                  : new Date(notification.timestamp).toLocaleString('pt-BR'))
                              : ''}
                          </span>
                        </div>
                        <p style={{ 
                          margin: 0, 
                          color: '#b2bac2', 
                          fontSize: '13px' 
                        }}>
                          {notification.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </NotificationPanel>
            )}
          </div>
        )}
        <LogoutButton onClick={onLogout}>
          <FaSignOutAlt size={20} />
        </LogoutButton>
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;