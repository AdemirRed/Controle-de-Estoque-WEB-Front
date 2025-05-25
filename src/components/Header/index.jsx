import React from 'react';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Header, LogoutButton, UserInfo } from './styles';

const HeaderComponent = ({ title, user, onLogout }) => {
  return (
    <Header>
      <h1>{title}</h1>
      <UserInfo>
        <FaUser size={20} />
        <span style={{ color: '#fff', marginRight: '10px' }}>
          {user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}
        </span>
        <LogoutButton onClick={onLogout}>
          <FaSignOutAlt size={20} />
          Sair
        </LogoutButton>
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;
