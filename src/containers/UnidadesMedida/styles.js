import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Container = styled.div`
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  background: linear-gradient(120deg, #181c24 0%, #232a36 100%);
  background-attachment: fixed;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 18px;
  box-shadow: 0 2px 16px #10131a33;
  animation: ${subtleGradient} 24s linear infinite;
  overflow-x: hidden;
  max-width: 100vw;

  @media (max-width: 900px) {
    padding: 1rem;
    max-width: 100%;
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

export const Title = styled.h2`
  color: #00eaff;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px #10131a;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
`;

/* Componentes removidos - usando estilos globais para tabelas */

export const AddButton = styled.button`
  background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px #10131a33;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;

  &:hover {
    background: linear-gradient(90deg, #0077b6 0%, #00b4d8 100%);
    box-shadow: 0 4px 16px #00b4d855;
    transform: translateY(-2px) scale(1.04);
  }
`;

export const FormContainer = styled.div`
  background: #232a36;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 16px #10131a33;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
`;

export const FormGroup = styled.div`
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: #eaf6fb;
  font-weight: 600;
  text-shadow: none;
`;

export const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #232a36;
  border-radius: 6px;
  background: #181c24;
  color: #eaf6fb;
  font-size: 1rem;
  box-shadow: none;

  &:focus {
    border-color: #00eaff;
    outline: none;
    box-shadow: 0 0 8px #00eaff44;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px #10131a33;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;

  &.primary {
    background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
    color: white;
    &:hover {
      background: linear-gradient(90deg, #0077b6 0%, #00b4d8 100%);
      box-shadow: 0 4px 16px #00b4d855;
      transform: translateY(-2px) scale(1.04);
    }
  }
  &.secondary {
    background: linear-gradient(90deg, #ff4b4b 0%, #c91407 100%);
    color: white;
    &:hover {
      background: linear-gradient(90deg, #c91407 0%, #ff4b4b 100%);
      box-shadow: 0 4px 16px #ff4b4b55;
      transform: translateY(-2px) scale(1.04);
    }
  }
`;
