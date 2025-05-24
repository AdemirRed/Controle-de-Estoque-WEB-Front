import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--dark-bg);
  * {
    color: inherit;
  }
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: var(--dark-surface);
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(0, 242, 250, 0.74);
`;

export const Title = styled.h1`
  text-align: center;
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(18, 181, 187, 0.69);
  
  /* Efeito de sombra em cada letra */
  @keyframes glowText {
    0% { text-shadow: 0 0 20px rgba(0, 247, 255, 0.79); }
    50% { text-shadow: 0 0 25px rgba(18, 181, 187, 0.89); }
    100% { text-shadow: 0 0 20px rgba(18, 181, 187, 0.69); }
  }
  
  animation: glowText 2s infinite;
  letter-spacing: 2px; /* Espaçamento entre as letras para melhor efeito */
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  font-size: 16px;
  color: #ffffff !important;
  background-color: #2c2c2c !important;
  box-shadow: 0 0 20px rgba(18, 181, 187, 0.69);

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }
`;

export const Button = styled.button`
  padding: 12px;
  background: var(--gradient-blue) !important;
  color: #ffffff !important;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    font-size: 14px;
  }
`;
