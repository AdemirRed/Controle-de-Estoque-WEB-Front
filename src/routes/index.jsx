import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../containers/Dashboard';
import Fornecedores from '../containers/Fornecedores';
import ItemRequests from '../containers/ItemRequests';
import Itens from '../containers/Itens';
import Login from '../containers/Login';
import MovimentacoesEstoque from '../containers/MovimentacoesEstoque';
import Pedidos from '../containers/Pedidos';
import Register from '../containers/Register';
import UnidadesMedida from '../containers/UnidadesMedida';
import Usuarios from '../containers/Usuarios';
import { ForgotPassword } from '../containers/ForgotPassword';

// Componente para proteger rotas
const PrivateRoute = ({ element, requiredRole = null }) => {
  const user = JSON.parse(localStorage.getItem('@App:user') || sessionStorage.getItem('@App:user') || 'null');
  const token = localStorage.getItem('@App:token') || sessionStorage.getItem('@App:token');
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.papel !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return element;
};

// Componente para rotas públicas
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem('@App:token') || sessionStorage.getItem('@App:token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return element;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <PublicRoute element={<Login />} />
  },
  {
    path: '/register',
    element: <PublicRoute element={<Register />} />
  },
  {
    path: '/forgot-password',
    element: <PublicRoute element={<ForgotPassword />} />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute element={<Dashboard />} />
  },
  {
    path: '/itens',
    element: <PrivateRoute element={<Itens />} />
  },
  {
    path: '/movimentacoes-estoque',
    element: <PrivateRoute element={<MovimentacoesEstoque />} />
  },
  {
    path: '/usuarios',
    element: <PrivateRoute element={<Usuarios />} requiredRole="ADMIN" />
  },
  {
    path: '/fornecedores',
    element: <PrivateRoute element={<Fornecedores />} />
  },
  {
    path: '/medidas',
    element: <PrivateRoute element={<UnidadesMedida />} />
  },
  {
    path: '/pedidos',
    element: <PrivateRoute element={<Pedidos />} />
  },
  {
    path: '/item-requests',
    element: <PrivateRoute element={<ItemRequests />} />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);
