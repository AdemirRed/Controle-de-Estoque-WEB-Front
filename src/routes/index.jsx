import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../containers/Dashboard';
import Fornecedores from '../containers/Fornecedores';
import Itens from '../containers/Itens';
import Login from '../containers/Login';
import MovimentacoesEstoque from '../containers/MovimentacoesEstoque';
import UnidadesMedida from '../containers/UnidadesMedida';
import Usuarios from '../containers/Usuarios';
import Pedidos from '../containers/Pedidos';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/itens',
    element: <Itens />,
  },
  {
    path: '/movimentacoes-estoque',
    element: <MovimentacoesEstoque />,
  },
  {
    path: '/usuarios',
    element: <Usuarios />,
  },
  {
    path: '/fornecedores',
    element: <Fornecedores />,
  },
  {
    path: '/medidas',
    element: <UnidadesMedida />,
  },
  {
    path: '/pedidos',
    element: <Pedidos />,
  }
]);
