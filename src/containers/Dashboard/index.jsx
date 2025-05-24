import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBox, 
  FaShoppingCart, 
  FaExchangeAlt, 
  FaChartLine, 
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaClipboardList
} from 'react-icons/fa';
import {
  Layout,
  Sidebar,
  MainContent,
  Header,
  UserInfo,
  LogoutButton,
  MenuItem,
  DashboardGrid,
  Card,
  CardHeader,
  CardTitle,
  CardValue,
  CardContent,
  ChartSection
} from './styles';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Dados mockados para exemplo
  const dashboardData = {
    totalProdutos: 150,
    pedidosPendentes: 12,
    movimentacoes: 45,
    valorTotal: 'R$ 25.000,00'
  };

  return (
    <Layout>
      <Sidebar>
        <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          OnnMoveis
        </h2>
        
        <MenuItem className="active">
          <FaHome size={20} />
          Dashboard
        </MenuItem>
        <MenuItem>
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
      </Sidebar>

      <MainContent>
        <Header>
          <h1>Dashboard</h1>
          <UserInfo>
            <FaUser size={20} />
            <span>{user?.nome || 'Usuário'}</span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt size={20} />
              Sair
            </LogoutButton>
          </UserInfo>
        </Header>

        <div style={{ padding: '20px' }}>
          <DashboardGrid>
            <Card>
              <CardHeader>
                <CardTitle>Total de Produtos</CardTitle>
                <FaBox size={24} color="#1a237e" />
              </CardHeader>
              <CardValue>{dashboardData.totalProdutos}</CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Produtos em estoque</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos Pendentes</CardTitle>
                <FaShoppingCart size={24} color="#f57c00" />
              </CardHeader>
              <CardValue>{dashboardData.pedidosPendentes}</CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Aguardando processamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimentações</CardTitle>
                <FaExchangeAlt size={24} color="#388e3c" />
              </CardHeader>
              <CardValue>{dashboardData.movimentacoes}</CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Últimas 24 horas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valor em Estoque</CardTitle>
                <FaChartLine size={24} color="#c2185b" />
              </CardHeader>
              <CardValue>{dashboardData.valorTotal}</CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Total em produtos</p>
              </CardContent>
            </Card>
          </DashboardGrid>

          <ChartSection>
            <h2 style={{ color: '#1a237e', marginBottom: '15px' }}>Histórico de Movimentações</h2>
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#666' 
            }}>
              Área reservada para gráfico de movimentações
            </div>
          </ChartSection>
        </div>
      </MainContent>
    </Layout>
  );
};

export default Dashboard;
