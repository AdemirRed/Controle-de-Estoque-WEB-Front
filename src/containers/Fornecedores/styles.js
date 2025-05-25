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
  position: relative;

  h1 {
    color: #eaf6fb;
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px #10131a;
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
  }

  .lista-fornecedores {
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
      
      button {
        padding: 8px 16px;
        background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
        box-shadow: 0 2px 8px #10131a33;
        transition: background 0.2s, box-shadow 0.2s, transform 0.15s;

        &:hover {
          background: linear-gradient(90deg, #0077b6 0%, #00b4d8 100%);
          box-shadow: 0 4px 16px #00b4d855;
          transform: translateY(-2px) scale(1.04);
        }
      }
    }
  }

  @media (max-width: 900px) {
    padding: 1rem;
    .lista-fornecedores {
      padding: 12px;
    }
    table, thead, tbody, th, td, tr {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    .lista-fornecedores {
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
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 16px #10131a33;
  transition: box-shadow 0.3s;

  input[type="text"],
  input[type="email"],
  input[type="tel"] {
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
  }
  
  .telefone-fields {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;

    input {
      margin-bottom: 0;
      width: auto;
      min-width: 60px;
      max-width: 120px;
      flex: 1;
    }
    input[name="telefone_numero"] {
      min-width: 140px;
      max-width: 200px;
      flex: 2;
    }
  }

  label {
    display: block;
    margin-bottom: 15px;
    color: #eaf6fb;
    font-weight: 600;
    text-shadow: none;
  }
  
  button {
    padding: 8px 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
    margin-right: 10px;
    background: linear-gradient(90deg, #00b4d8 0%, #0077b6 100%);
    color: #fff;
    box-shadow: 0 2px 8px #10131a33;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;

    &[type="submit"] {
      &:hover {
        background: linear-gradient(90deg, #0077b6 0%, #00b4d8 100%);
        box-shadow: 0 4px 16px #00b4d855;
        transform: translateY(-2px) scale(1.04);
      }
    }
    
    &[type="button"] {
      background: linear-gradient(90deg, #ff4b4b 0%, #c91407 100%);
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
