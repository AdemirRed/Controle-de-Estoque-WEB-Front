import React, { useState } from 'react';
import {
  FaBox,
  FaClipboardList,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaRuler,
  FaUsers,
  FaWarehouse,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo, MenuItem, Sidebar, MobileMenuButton } from './styles';

const MenuSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Fecha o menu ao navegar
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Fecha menu ao clicar fora (overlay)
  const handleOverlayClick = () => setOpen(false);

  return (
    <>
      <MobileMenuButton
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      {/* Overlay para fechar menu ao clicar fora */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1199
          }}
          onClick={handleOverlayClick}
        />
      )}
      <Sidebar $open={open}>
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
      </Sidebar>
    </>
  );
};

export default MenuSidebar;
