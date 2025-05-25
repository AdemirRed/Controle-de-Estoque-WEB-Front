import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../containers/Login';
import Dashboard from '../containers/Dashboard';
import Itens from '../containers/Itens';
import MovimentacoesEstoque from '../containers/MovimentacoesEstoque';
import Usuarios from '../containers/Usuarios';
import Fornecedores from '../containers/Fornecedores';

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
  }
]);
