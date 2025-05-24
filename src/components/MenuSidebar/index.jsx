import React from 'react';
import {
  FaBox,
  FaClipboardList,
  FaExchangeAlt,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaRuler,
  FaTags,
  FaUsers,
  FaWarehouse
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar, MenuItem, Logo } from './styles';

const MenuSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar>
      <Logo>OnnMoveis</Logo>
      
      <MenuItem 
        className={isActive('/dashboard') ? 'active' : ''} 
        onClick={() => navigate('/dashboard')}
      >
        <FaHome size={20} />
        Dashboard
      </MenuItem>
      
      <MenuItem 
        className={isActive('/itens') ? 'active' : ''} 
        onClick={() => navigate('/itens')}
      >
        <FaBox size={20} />
        Produtos
      </MenuItem>
      
      <MenuItem>
        <FaClipboardList size={20} />
        Pedidos
      </MenuItem>
      
      <MenuItem>
        <FaExchangeAlt size={20} />
        Movimentações
      </MenuItem>

      {user?.papel === 'admin' && (
        <>
          <MenuItem>
            <FaHandshake size={20} />
            Fornecedores
          </MenuItem>
          <MenuItem>
            <FaWarehouse size={20} />
            Movimentação de Estoque
          </MenuItem>
          <MenuItem>
            <FaTags size={20} />
            Categorias Estoque
          </MenuItem>
          <MenuItem>
            <FaRuler size={20} />
            Unidade de Medida
          </MenuItem>
          <MenuItem>
            <FaFileAlt size={20} />
            Relatório de Pedidos
          </MenuItem>
          <MenuItem>
            <FaUsers size={20} />
            Usuários
          </MenuItem>
        </>
      )}
    </Sidebar>
  );
};

export default MenuSidebar;
