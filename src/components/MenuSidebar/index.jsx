import React from 'react';
import {
  FaBox,
  FaClipboardList,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaRuler,
  FaUsers,
  FaWarehouse
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo, MenuItem, Sidebar } from './styles';

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
      
      <MenuItem 
        className={isActive('/pedidos') ? 'active' : ''} 
        onClick={() => navigate('/pedidos')}
      >
        <FaClipboardList size={20} />
        Pedidos
      </MenuItem>
      
      {user?.papel === 'admin' && (
        <>
          <MenuItem
            className={isActive('/fornecedores') ? 'active' : ''}
            onClick={() => navigate('/fornecedores')}
          >
            <FaHandshake size={20} />
            Fornecedores
          </MenuItem>
          <MenuItem
            className={isActive('/movimentacoes-estoque') ? 'active' : ''}
            onClick={() => navigate('/movimentacoes-estoque')}
          >
            <FaWarehouse size={20} />
            Movimentação de Estoque
          </MenuItem>
          <MenuItem
          className={isActive('/medidas') ? 'active' : ''}
          onClick={() => navigate('/medidas')}
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
            onClick={() => navigate('/usuarios')}
          >
            <FaUsers size={20} />
            Usuários
          </MenuItem>
        </>
      )}
    </Sidebar>
  );
};

export default MenuSidebar;
