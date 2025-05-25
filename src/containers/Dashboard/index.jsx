import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
    FaBox,
    FaChartLine,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaShoppingCart,
    FaSignOutAlt,
    FaUser,
    FaBars
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MenuSidebar from '../../components/MenuSidebar';
import HeaderComponent from '../../components/Header';
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

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const [chartData, setChartData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);

  // Fecha o menu lateral ao navegar em telas pequenas
  const handleSidebarNavigate = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itensResponse, movimentacoesResponse, pedidosPendentesResponse] = await Promise.all([
          api.get('/itens'),
          api.get('/movimentacoes-estoque'),
          api.get('/pedidos?status=pendente')
        ]);
        
        const itens = itensResponse.data;
        const movimentacoes = movimentacoesResponse.data;
        // pedidosPendentesResponse.data.total é o número correto de pedidos pendentes
        const pedidosPendentesTotal = pedidosPendentesResponse.data.total;
        
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
          pedidosPendentes: pedidosPendentesTotal,
          movimentacoes: ultimas24h.length,
          valorTotal: valorTotal,
          estoqueBaixo: estoqueBaixo
        });

        // Processar dados para o gráfico
        const hoje = new Date();
        const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
          const data = new Date(hoje);
          data.setDate(data.getDate() - i);
          return data;
        }).reverse();

        const dadosGrafico = ultimos7Dias.map(data => {
          const movimentacoesDia = movimentacoesResponse.data.filter(mov => {
            const movData = new Date(mov.created_at);
            return movData.toDateString() === data.toDateString();
          });

          const entradas = movimentacoesDia.filter(mov => mov.tipo === 'entrada')
            .reduce((total, mov) => total + Number(mov.quantidade), 0);
          
          const saidas = movimentacoesDia.filter(mov => mov.tipo === 'saida')
            .reduce((total, mov) => total + Number(mov.quantidade), 0);

          return {
            data: data.toLocaleDateString('pt-BR'),
            entradas,
            saidas
          };
        });

        setChartData({
          labels: dadosGrafico.map(d => d.data),
          datasets: [
            {
              label: 'Entradas',
              data: dadosGrafico.map(d => d.entradas),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Saídas',
              data: dadosGrafico.map(d => d.saidas),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }
          ]
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
      {/* Botão de abrir menu lateral fixo em telas pequenas */}
      {!sidebarOpen && (
        <button
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 3000,
            background: '#132040',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            color: '#00f2fa',
            fontSize: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0008',
            cursor: 'pointer'
          }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>
      )}
      {/* Sidebar responsivo */}
      {sidebarOpen && (
        <>
          {/* Overlay para fechar menu ao clicar fora em telas pequenas */}
          {window.innerWidth <= 900 && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                zIndex: 199
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            style={{
              minWidth: 250,
              maxWidth: 300,
              width: '100%',
              transition: 'all 0.3s',
              zIndex: 200,
              background: '#132040',
              position: window.innerWidth <= 900 ? 'fixed' : 'relative',
              top: window.innerWidth <= 900 ? 0 : undefined,
              left: window.innerWidth <= 900 ? 0 : undefined,
              height: window.innerWidth <= 900 ? '100vh' : undefined,
              boxShadow: window.innerWidth <= 900 ? '2px 0 16px #0008' : undefined
            }}
          >
            {/* Botão de fechar menu lateral só em telas pequenas */}
            <button
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: '#00f2fa',
                fontSize: 28,
                display: window.innerWidth <= 900 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3001
              }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <FaBars style={{ transform: 'rotate(45deg)' }} />
            </button>
            <MenuSidebar onNavigate={handleSidebarNavigate} />
          </div>
        </>
      )}
      <MainContent>
        <HeaderComponent 
          title="Dashboard"
          user={user}
          onLogout={handleLogout}
        />
        <div style={{ padding: '20px' }}>
          <DashboardGrid>
            <Card
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/itens')}
              title="Ver produtos"
            >
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

            <Card
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/pedidos?status=pendente')}
              title="Ver pedidos pendentes"
            >
              <CardHeader>
                <CardTitle>Pedidos Pendentes</CardTitle>
                <FaShoppingCart size={24} color="#f57c00" />
              </CardHeader>
              <CardValue>
                {loading ? 'Carregando...' : dashboardData.pedidosPendentes}
              </CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Aguardando processamento</p>
              </CardContent>
            </Card>

            <Card
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/movimentacoes-estoque')}
              title="Ver movimentações"
            >
              <CardHeader>
                <CardTitle>Movimentações</CardTitle>
                <FaExchangeAlt size={24} color="#388e3c" />
              </CardHeader>
              <CardValue>{dashboardData.movimentacoes}</CardValue>
              <CardContent>
                <p style={{ color: '#666' }}>Últimas 24 horas</p>
              </CardContent>
            </Card>

            <Card
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/itens')}
              title="Ver valor em estoque"
            >
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

            <Card
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/itens?filtro=baixo')}
              title="Ver itens com estoque baixo"
            >
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
            <div className="chart-container">
              {chartData ? (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#0015FF'
                        }
                      },
                      title: {
                        display: true,
                        text: 'Movimentações dos Últimos 7 Dias',
                        color: '#0015FF'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 21, 255, 0.1)'
                        },
                        ticks: {
                          color: '#0015FF'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(0, 21, 255, 0.1)'
                        },
                        ticks: {
                          color: '#0015FF'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{ 
                  height: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#0015FF' 
                }}>
                  Carregando gráfico...
                </div>
              )}
            </div>
          </ChartSection>
        </div>
      </MainContent>
    </Layout>
  );
};

export default Dashboard;
