import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Header, LogoutButton, NotificationBadge, NotificationPanel, UserInfo } from './styles';

const HeaderComponent = ({ title, user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([]);

  const handleNotificationAction = async (id, action) => {
    // Implementar ação de aprovação/rejeição
    if (Notification.permission === 'granted') {
      new Notification(`Pedido ${action === 'approve' ? 'aprovado' : 'rejeitado'}`);
    }
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
          if (permission === 'denied') {
            toast.info('As notificações estão bloqueadas. Para ativar, libere manualmente nas configurações do navegador para este site.');
          }
        });
      } else if (Notification.permission === 'denied') {
        toast.info('As notificações estão bloqueadas. Para ativar, libere manualmente nas configurações do navegador para este site.');
      }
    }
  }, []);

  return (
    <Header>
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
        {user?.papel === 'admin' && (
          <NotificationBadge count={notifications.length} onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={20} />
          </NotificationBadge>
        )}
        <FaUser size={20} />
        <span>{user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}</span>
        <LogoutButton onClick={onLogout}>
          <FaSignOutAlt size={20} />
          Sair
        </LogoutButton>

        {showNotifications && (
          <NotificationPanel>
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <p>Pedido #{notification.id}</p>
                <p>{notification.descricao}</p>
                <div className="actions">
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleNotificationAction(notification.id, 'approve')}
                  >
                    Aprovar
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="error"
                    onClick={() => handleNotificationAction(notification.id, 'reject')}
                  >
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </NotificationPanel>
        )}
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;
