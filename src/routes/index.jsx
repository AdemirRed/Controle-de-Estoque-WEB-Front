import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../containers/Login';
import Dashboard from '../containers/Dashboard';
import Itens from '../containers/Itens';
import MovimentacoesEstoque from '../containers/MovimentacoesEstoque';

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
  }
]);
