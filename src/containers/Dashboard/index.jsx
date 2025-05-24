import React from 'react';
import {
  FaBox,
  FaChartLine,
  FaExchangeAlt,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuSidebar from '../../components/MenuSidebar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardValue,
  ChartSection,
  DashboardGrid,
  Header,
  Layout,
  LogoutButton,
  MainContent,
  UserInfo
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

  const dashboardData = {
    totalProdutos: 150,
    pedidosPendentes: 12,
    movimentacoes: 45,
    valorTotal: 'R$ 25.000,00'
  };

  return (
    <Layout>
      <MenuSidebar />
      <MainContent>
        <Header>
          <h1>Dashboard</h1>
          <UserInfo>
            <FaUser size={20} />
            <span style={{ color: '#fff', marginRight: '10px' }}>
              {user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}
            </span>
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
            <h2 style={{ color: '#0015FF', marginBottom: '15px' }}>Histórico de Movimentações</h2>
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
