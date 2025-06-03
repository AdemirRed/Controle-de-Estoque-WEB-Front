import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Container = styled.div`
  padding: 20px;
  background: linear-gradient(120deg, #181c24 0%, #232a36 100%);
  min-height: 100vh;
  animation: ${subtleGradient} 24s linear infinite;
`;

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: transparent;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: #181c24;
  padding: 20px;
  box-shadow: 2px 0 8px #10131a33;
`;

export const MainContent = styled.div`
  flex: 1;
  background: transparent;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #232a36;
  box-shadow: 0 2px 12px #10131a33;
  color: #eaf6fb;
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
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px #10131a33;

  &:hover {
    background: linear-gradient(135deg, #c91407 0%, #ff4b4b 100%);
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 16px #ff4b4b55;
  }
`;

export const MenuItem = styled.div`
  padding: 12px;
  margin: 5px 0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #232a36;
  color: #00eaff;
  box-shadow: none;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #181c24;
    color: #fff;
  }

  &.active {
    background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
    color: #fff;
    box-shadow: 0 2px 8px #00b4d855;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Card = styled.div`
  background: #232a36;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 2px 16px #10131a33;
  transition: transform 0.2s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 4px 24px #00b4d855;
    background: #181c24;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const CardTitle = styled.h3`
  color: #00eaff;
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-shadow: 0 1px 4px #10131a;
`;

export const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #eaf6fb;
  text-shadow: none;
`;

export const CardContent = styled.div`
  margin-top: 10px;
  color: #b3e5fc;
`;

export const ChartSection = styled.div`
  background: #232a36;
  padding: 24px;
  border-radius: 14px;
  margin-top: 32px;
  box-shadow: 0 2px 16px #10131a33;
  height: 400px;
  display: flex;
  flex-direction: column;

  .chart-container {
    flex: 1;
    min-height: 0;
    position: relative;
  }

  @media (max-width: 900px) {
    padding: 12px;
    height: 320px;
  }
`;
