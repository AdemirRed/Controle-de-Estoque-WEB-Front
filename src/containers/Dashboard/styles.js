import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
  min-height: 100vh;
`;

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: var(--dark-surface);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const MainContent = styled.div`
  flex: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1))
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: rgb(0, 4, 14);
 color:rgb(0, 21, 255);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ff4b4b 0%, #c91407 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ff3333 0%, #a31206 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(201, 20, 7, 0.3);
  }
`;

export const MenuItem = styled.div`
  padding: 12px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgb(0, 4, 14); //Azul mais escuro
  ;
  color:rgb(0, 21, 255);
  
  &:hover {
    background: rgba(196, 196, 196, 0.1);
  }

  &.active {
    background: rgb(0, 72, 255);
    color: rgb(0, 0, 0);
  }
`;

export const DashboardGrid = styled.div`

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const Card = styled.div`

  
  background-color: rgb(0, 4, 14);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));

  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
`;

export const CardTitle = styled.h3`
 color:rgb(0, 21, 255);
  margin: 0;
  
`;

export const CardValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  color:rgb(0, 21, 255);
`;

export const CardContent = styled.div`

  margin-top: 10px;
`;

export const ChartSection = styled.div`
  background-color: rgb(0, 4, 14);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 400px; // Altura fixa para o container
  display: flex;
  flex-direction: column;

  .chart-container {
    flex: 1;
    min-height: 0; // Importante para o flex funcionar corretamente
    position: relative; // Para o gráfico se ajustar corretamente
  }
`;
