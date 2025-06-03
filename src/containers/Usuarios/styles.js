import styled, { keyframes } from 'styled-components';

// Sutil animação de gradiente para um toque moderno, mas discreto
const subtleGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(120deg, #181c24 0%, #232a36 100%);
  animation: ${subtleGradient} 24s linear infinite;
`;

export const Content = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  h1 {
    color: #00eaff;
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px #10131a;
  }

  .lista-usuarios {
    background: #232a36;
    border-radius: 12px;
    padding: 24px;
    margin-top: 2rem;
    box-shadow: 0 2px 16px #10131a33;
    transition: box-shadow 0.3s;
    overflow-x: auto;

    h2 {
      color: #eaf6fb;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
      font-weight: 500;
      text-shadow: 0 1px 4px #10131a;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;

      th, td {
        padding: 12px 10px;
        text-align: left;
        border-bottom: 1px solid #232a36;
        font-size: 0.98rem;
      }
      
      th {
        font-weight: 700;
        background: #181c24;
        color: #00eaff;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 6px 6px 0 0;
        box-shadow: none;
      }

      td {
        color: #eaf6fb;
        font-size: 1rem;
        text-shadow: none;
      }
      
      tr:hover {
        background: #232a36cc;
        transition: background 0.2s;
      }
    }
  }

  @media (max-width: 900px) {
    padding: 1rem;
    .lista-usuarios {
      padding: 12px;
    }
    table, thead, tbody, th, td, tr {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    .lista-usuarios {
      padding: 6px;
    }
    table {
      min-width: 400px;
    }
  }
`;

export const Form = styled.form`
  background: #232a36;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 2px 16px #10131a33;

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #232a36;
    border-radius: 6px;
    background: #181c24;
    color: #eaf6fb;
    margin-bottom: 15px;
    font-size: 1rem;
    box-shadow: none;

    &:focus {
      border-color: #00eaff;
      outline: none;
      box-shadow: 0 0 8px #00eaff44;
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }

  select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #232a36;
    border-radius: 6px;
    background: #181c24;
    color: #eaf6fb;
    margin-bottom: 15px;
    transition: border-color 0.3s ease;
    cursor: pointer;

    &:focus {
      border-color: #00eaff;
      outline: none;
    }

    option {
      background-color: #181c24;
      color: #eaf6fb;
    }
  }
  
  label {
    display: block;
    margin-bottom: 15px;
    color: #eaf6fb;
    font-weight: 600;
    span {
      display: block;
      margin-bottom: 5px;
    }
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    margin-right: 10px;

    &[type="submit"] {
      background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
      color: #fff;
      &:hover {
        background: linear-gradient(90deg, #0077b6 0%, #00b4d8 100%);
        box-shadow: 0 4px 16px #00b4d855;
        transform: translateY(-2px) scale(1.04);
      }
    }
    
    &[type="button"] {
      background: linear-gradient(90deg, #ff4b4b 0%, #c91407 100%);
      color: #fff;
      &:hover {
        background: linear-gradient(90deg, #c91407 0%, #ff4b4b 100%);
        box-shadow: 0 4px 16px #ff4b4b55;
        transform: translateY(-2px) scale(1.04);
      }
    }
  }

  @media (max-width: 600px) {
    padding: 10px;
    max-width: 100%;
  }
`;

export const DetailsContainer = styled.div`
  background-color: #232a36;
  padding: 24px;
  border-radius: 12px;
  width: 500px;
  box-shadow: 0 2px 16px #10131a33;
`;

export const DetailsHeader = styled.h2`
  color: #00eaff;
  font-size: 2rem;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #232a36;
`;

export const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #181c24;
  border-radius: 6px;
`;

export const DetailsLabel = styled.span`
  color: #00eaff;
  font-weight: 600;
  width: 120px;
  flex-shrink: 0;
`;

export const DetailsValue = styled.span`
  color: #eaf6fb;
  flex: 1;
`;

export const FormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(4, 8, 8, 0.62);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px #00b4d855;
    }
  }

  &.secondary {
    background: linear-gradient(135deg, #dc3545 0%, #981b1b 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #bb2d3b 0%, #7c1616 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px #dc354555;
    }
  }
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  background-color: transparent;

  svg {
    font-size: 16px;
    color: #fff;
  }

  &.edit-button {
    background-color: #2196f3;
    &:hover { background-color: #1976d2; transform: scale(1.12); }
  }

  &.view-button {
    background-color: #bbc527;
    &:hover { background-color: #989f1f; transform: scale(1.12); }
  }

  &.delete-button {
    background-color: #dc3545;
    &:hover { background-color: #bb2d3b; transform: scale(1.12); }
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
  }
`;
