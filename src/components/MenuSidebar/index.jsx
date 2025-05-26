import React from 'react';
import {
  FaBox,
  FaClipboardList,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaRuler,
  FaUsers,
  FaWarehouse,
  FaPlusCircle
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo, MenuItem, Sidebar } from './styles';

const MenuSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Fecha o menu ao navegar
  const handleNavigate = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    if (signOut) signOut();
    navigate('/login');
  };

  return (
    <Sidebar $open={true}>
      <Logo>OnnMoveis</Logo>
      <MenuItem
        className={isActive('/dashboard') ? 'active' : ''}
        onClick={() => handleNavigate('/dashboard')}
      >
        <FaHome size={20} />
        Dashboard
      </MenuItem>
      <MenuItem
        className={isActive('/itens') ? 'active' : ''}
        onClick={() => handleNavigate('/itens')}
      >
        <FaBox size={20} />
        Produtos
      </MenuItem>
      <MenuItem
        className={isActive('/pedidos') ? 'active' : ''}
        onClick={() => handleNavigate('/pedidos')}
      >
        <FaClipboardList size={20} />
        Pedidos
      </MenuItem>
      <MenuItem
        className={isActive('/item-requests') ? 'active' : ''}
        onClick={() => handleNavigate('/item-requests')}
      >
        <FaPlusCircle size={20} />
        Requisições de Itens
      </MenuItem>
      {user?.papel === 'admin' && (
        <>
          <MenuItem
            className={isActive('/fornecedores') ? 'active' : ''}
            onClick={() => handleNavigate('/fornecedores')}
          >
            <FaHandshake size={20} />
            Fornecedores
          </MenuItem>
          <MenuItem
            className={isActive('/movimentacoes-estoque') ? 'active' : ''}
            onClick={() => handleNavigate('/movimentacoes-estoque')}
          >
            <FaWarehouse size={20} />
            Movimentação de Estoque
          </MenuItem>
          <MenuItem
            className={isActive('/medidas') ? 'active' : ''}
            onClick={() => handleNavigate('/medidas')}
          >
            <FaRuler size={20} />
            Unidade de Medida
          </MenuItem>
          <MenuItem>
            <FaFileAlt size={20} />
            Relatório de Pedidos
          </MenuItem>
          <MenuItem
            className={isActive('/usuarios') ? 'active' : ''}
            onClick={() => handleNavigate('/usuarios')}
          >
            <FaUsers size={20} />
            Usuários
          </MenuItem>
        </>
      )}
      {/* Botão de sair */}
      <MenuItem onClick={handleLogout}>
        <FaHome size={20} style={{ opacity: 0 }} />
        Sair
      </MenuItem>
    </Sidebar>
  );
};

export default MenuSidebar;
