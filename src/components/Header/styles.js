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

  &::after {
    content: '${props => props.count || ''}';
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(90deg, #ff4b4b, #c91407);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    display: ${props => props.count ? 'block' : 'none'};
    box-shadow: 0 2px 8px #10131a33;
  }
`;

export const NotificationPanel = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: #232a36;
  border: 1px solid #00eaff55;
  border-radius: 12px;
  padding: 15px;
  width: 320px;
  box-shadow: 0 2px 16px #10131a33;
  z-index: 1000;

  .notification-item {
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    &:last-child {
      border-bottom: none;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }
`;
