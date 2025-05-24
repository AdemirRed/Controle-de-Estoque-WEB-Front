import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../containers/Login';
import Dashboard from '../containers/Dashboard'; // Importe o componente Dashboard

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
    path: '/dashboard', // Adicionada a rota para o Dashboard
    element: <Dashboard />,
  },
]);
