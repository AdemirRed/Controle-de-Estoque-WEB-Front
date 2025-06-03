import styled, { keyframes } from 'styled-components';

// Animação de balanço para o ícone de cadeado
const lockSwing = keyframes`
  0% { transform: rotate(-10deg);}
  20% { transform: rotate(10deg);}
  40% { transform: rotate(-8deg);}
  60% { transform: rotate(8deg);}
  80% { transform: rotate(-4deg);}
  100% { transform: rotate(0deg);}
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #181c24 0%, #232a36 100%);
  padding: 20px;
`;

export const AnimatedLock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  svg {
    animation: ${lockSwing} 1.8s cubic-bezier(.36,.07,.19,.97) infinite;
    color: #00eaff;
    font-size: 3.2rem;
    filter: drop-shadow(0 2px 8px #00eaff44);
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 18px;
  color: #00eaff;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #10131a99;
`;

export const Form = styled.form`
  background: #232a36;
  border-radius: 12px;
  box-shadow: 0 4px 24px #10131a55, 0 1.5px 6px #0004;
  padding: 32px 28px 24px 28px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  min-width: 300px;
`;

export const InputContainer = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 7px;
    font-size: 15px;
    color: #00eaff;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    padding: 12px 14px 12px 38px;
    font-size: 15px;
    border: 1.5px solid #00eaff55;
    border-radius: 6px;
    background: #181c24;
    color: #eaf6fb;
    font-weight: 500;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px #00eaff11;

    &::placeholder {
      color: #00eaff88;
      opacity: 1;
      font-weight: 400;
    }
  }

  input:focus {
    border: 1.5px solid #00eaff;
    background: #232a36;
    color: #fff;
  }

  input:disabled {
    background-color: #232a36;
    color: #7bbcb7;
    opacity: 0.7;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #00eaff88;
    pointer-events: none;
  }

  position: relative;
`;

export const Validacao = styled.span`
  font-size: 12px;
  color: ${(props) => (props.red ? '#ff4b4b' : '#00eaff')};
  margin-top: 5px;
  display: block;
`;

export const FeedbackMessage = styled.div`
  margin-top: 28px;
  font-size: 15px;
  color: #00eaff;
  background: #181c24;
  border-radius: 8px;
  padding: 18px 16px;
  text-align: center;
  box-shadow: 0 2px 8px #00eaff22;

  p {
    margin: 0;
  }
`;

export const Button = styled.button`
  margin-top: 12px;
  padding: 12px 0;
  border-radius: 6px;
  background: linear-gradient(90deg, #00eaff 60%, #1e948a 100%);
  color: #181c24;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 2px 8px #00eaff22;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #1e948a 60%, #00eaff 100%);
    opacity: 0.95;
    color: #fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
