import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Sidebar = styled.div`
  width: 250px;
  min-height: 100vh;
  background: #181c24;
  animation: ${subtleGradient} 24s linear infinite;
  padding: 20px;
  box-shadow: 2px 0 8px #10131a33;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s;
  z-index: 200;
  position: relative;

  @media (max-width: 900px) {
    width: 180px;
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 200;
    box-shadow: 2px 0 16px #0008;
  }
  @media (max-width: 600px) {
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-110%)')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    display: block;
    width: 80vw;
    max-width: 320px;
    box-shadow: 2px 0 16px #10131a99;
  }
`;

export const MenuItem = styled.div`
  padding: 12px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #232a36;
  color: #00eaff;
  box-shadow: none;
  transition: background 0.2s, color 0.2s, transform 0.15s;

  &:hover {
    background: #181c24;
    color: #fff;
    transform: scale(1.03);
    box-shadow: 0 2px 8px #00b4d855;
  }

  &.active {
    background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
    color: #fff;
    box-shadow: 0 2px 8px #00b4d855;
  }
`;

export const Logo = styled.h2`
  color: #00eaff;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
  letter-spacing: 2px;
  font-size: 2rem;
  text-shadow: 0 2px 8px #10131a;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
`;

export const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 1201;
  background: #232a36;
  color: #00eaff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #10131a33;
  cursor: pointer;
  font-size: 1.6rem;

  @media (max-width: 600px) {
    display: flex;
  }
`;
