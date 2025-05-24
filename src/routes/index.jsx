import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../containers/Login';
import Dashboard from '../containers/Dashboard';
import Itens from '../containers/Itens';

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
  }
]);
