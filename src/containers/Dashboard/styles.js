import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
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
  background-color: #f0f2f5;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: #f44336;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    opacity: 0.8;
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
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: var(--gradient-blue);
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const CardTitle = styled.h3`
  color: #1a237e;
  margin: 0;
`;

export const CardValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export const CardContent = styled.div`
  margin-top: 10px;
`;

export const ChartSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
