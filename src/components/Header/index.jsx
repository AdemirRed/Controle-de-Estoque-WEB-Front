import React, { useState } from 'react';
import { FaSignOutAlt, FaUser, FaBell } from 'react-icons/fa';
import { Header, LogoutButton, UserInfo, NotificationBadge, NotificationPanel } from './styles';
import { Button } from '@mui/material';

const HeaderComponent = ({ title, user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleNotificationAction = async (id, action, motivo = '') => {
    // Implementar ação de aprovação/rejeição
    if (Notification.permission === 'granted') {
      new Notification(`Pedido ${action === 'approve' ? 'aprovado' : 'rejeitado'}`);
    }
    setShowNotifications(false);
  };

  React.useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    // Aqui você implementaria a busca de notificações do backend
  }, []);

  return (
    <Header>
      <h1>{title}</h1>
      <UserInfo>
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
