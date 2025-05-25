import React, { useEffect, useState } from 'react';
import {
    FaBox,
    FaChartLine,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaShoppingCart,
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
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
  const [dashboardData, setDashboardData] = useState({
    totalProdutos: 0,
    pedidosPendentes: 0,
    movimentacoes: 0,
    valorTotal: 0,
    estoqueBaixo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itensResponse, movimentacoesResponse] = await Promise.all([
          api.get('/itens'),
          api.get('/movimentacoes-estoque')
        ]);
        
        const itens = itensResponse.data;
        const movimentacoes = movimentacoesResponse.data;
        
        const valorTotal = itens.reduce((total, item) => {
          return total + (item.preco || 0) * (item.quantidade || 0);
        }, 0);

        console.log('Itens:', itens);
        
        const estoqueBaixo = itens.filter(item => {
          console.log(`Item ${item.nome}:`, {
            quantidade: item.quantidade,
            estoque_minimo: item.quantidade_minima // Alterado para quantidade_minima
          });
          // Converte para número e verifica se a quantidade é menor ou igual à quantidade mínima
          return Number(item.quantidade) <= Number(item.quantidade_minima);
        }).length;

        console.log('Total itens com estoque baixo:', estoqueBaixo);

        // Filtra movimentações das últimas 24 horas
        const ultimas24h = movimentacoes.filter(mov => {
          const movData = new Date(mov.created_at);
          const hoje = new Date();
          const diff = hoje - movData;
          return diff <= 24 * 60 * 60 * 1000;
        });

        setDashboardData({
          totalProdutos: itens.length,
          pedidosPendentes: 0,
          movimentacoes: ultimas24h.length,
          valorTotal: valorTotal,
          estoqueBaixo: estoqueBaixo
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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
              <CardValue>
                {loading ? 'Carregando...' : dashboardData.totalProdutos}
              </CardValue>
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
              <CardValue>
                {loading ? 'Carregando...' : formatarMoeda(dashboardData.valorTotal)}
              </CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Total em produtos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estoque Baixo</CardTitle>
                <FaExclamationTriangle size={24} color="#ff9800" />
              </CardHeader>
              <CardValue>
                {loading ? 'Carregando...' : dashboardData.estoqueBaixo}
              </CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Itens abaixo do mínimo</p>
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
