import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(120deg, #181c24 0%, #232a36 100%);
  animation: ${subtleGradient} 24s linear infinite;
  max-width: 100vw;
  overflow-x: hidden;
`;

export const MainContent = styled.div`
  flex: 1;
  background: transparent;
  min-width: 0;
  overflow-x: hidden;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #232a36;
  color: #eaf6fb;
  box-shadow: 0 2px 12px #10131a33;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #eaf6fb;
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

export const Container = styled.div`
  padding: 20px;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const FormContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: #232a36;
  border-radius: 12px;
  box-shadow: 0 2px 16px #10131a33;
  color: #eaf6fb;

  h2 {
    color: #00eaff;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  form {
    display: grid;
    gap: 15px;

    div {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      color: #eaf6fb;
      font-size: 0.95rem;
    }

    input, select, textarea {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #232a36;
      background-color: #181c24;
      color: #eaf6fb;

      &:focus {
        outline: none;
        border-color: #00eaff;
        box-shadow: 0 0 8px #00eaff44;
      }
    }

    button {
      background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
      color: white;
      padding: 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px #00b4d855;
      }
    }
  }
`;

export const ListContainer = styled.div`
  background: #232a36;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 16px #10131a33;
  color: #eaf6fb;
  max-width: 100%;
  overflow: hidden;

  h2 {
    color: #00eaff;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 70vh;
    background: transparent;
    border-radius: 8px;
    
    /* Barra de scroll customizada */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #181c24;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #00b4d8;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #0077b6;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    min-width: 600px; /* Largura mínima para manter layout */

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #232a36;
      white-space: nowrap;
    }

    th {
      background-color: #181c24;
      color: #00eaff;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    td {
      color: #eaf6fb;
    }

    tr:hover {
      background-color: rgba(0, 180, 216, 0.1);
    }

    button {
      background: linear-gradient(135deg, #ff4b4b 0%, #c91407 100%);
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        background: linear-gradient(135deg, #c91407 0%, #ff4b4b 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px #ff4b4b55;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 15px;
    
    .table-wrapper {
      max-height: 60vh;
    }
    
    table {
      min-width: 500px;
      
      th, td {
        padding: 8px;
        font-size: 0.9rem;
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    
    table {
      min-width: 400px;
      
      th, td {
        padding: 6px;
        font-size: 0.8rem;
      }
    }
  }
`;
