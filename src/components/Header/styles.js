import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #232a36;
  color: #eaf6fb;
  box-shadow: 0 2px 12px #10131a33;
  animation: ${subtleGradient} 24s linear infinite;

  h1 {
    font-size: 2rem;
    margin: 0;
    font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
    letter-spacing: 2px;
    color: #00eaff;
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
    text-shadow: 0 2px 8px #10131a;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    h1 {
      font-size: 1.2rem;
    }
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #ff4b4b, #c91407);
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 6px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px #10131a33;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;

  &:hover {
    color: #fff;
    background: linear-gradient(90deg, #c91407, #ff4b4b);
    box-shadow: 0 4px 16px #ff4b4b55;
    transform: translateY(-2px) scale(1.04);
  }
`;

export const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 15px;
  color: #00eaff;
  transition: color 0.2s;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(0, 234, 255, 0.1);
  }

  &::after {
    content: '${props => props.count || ''}';
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(90deg, #ff4b4b, #c91407);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: bold;
    display: ${props => props.count ? 'block' : 'none'};
    box-shadow: 0 2px 8px #10131a33;
    min-width: 16px;
    height: 16px;
    text-align: center;
    line-height: 12px;
  }
`;

export const NotificationPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #232a36;
  border: 1px solid #00eaff55;
  border-radius: 12px;
  padding: 16px;
  width: 380px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  margin-top: 8px;

  @media (max-width: 480px) {
    width: 300px;
    right: -50px;
  }

  .notification-item {
    border-radius: 6px;
    margin-bottom: 4px;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    &:hover {
      background-color: rgba(0, 234, 255, 0.05) !important;
    }
  }
`;
