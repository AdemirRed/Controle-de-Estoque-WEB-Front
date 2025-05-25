import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: rgb(17 24 39);
`;

export const Content = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  h1 {
    color: #fff;
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .lista-fornecedores {
    background: #1f2937;
    border-radius: 8px;
    padding: 24px;
    margin-top: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    h2 {
      color: #fff;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 12px 10px;  // Reduzido o padding lateral para caber mais colunas
        text-align: left;
        border-bottom: 1px solid #374151;
        font-size: 0.9rem;  // Reduzido o tamanho da fonte
      }
      
      th {
        font-weight: 600;
        background: #111827;
        color: #fff;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      td {
        color: #fff;
        font-size: 1rem;
      }
      
      tr:hover {
        background-color: #374151;
      }
      
      button {
        padding: 8px 16px;
        background: #4299E1;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
          background: #3182CE;
        }
      }
    }
  }
`;

export const Form = styled.form`
  background-color: #1f2937;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  input[type="text"],
  input[type="email"],
  input[type="tel"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #374151;
    border-radius: 4px;
    background-color: #111827;
    color: white;
    margin-bottom: 15px;
    
    &:focus {
      border-color: #4299E1;
      outline: none;
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
    color: #fff;
    font-weight: 500;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-right: 10px;
    
    &[type="submit"] {
      background: #4299E1;
      color: white;
      
      &:hover {
        background: #3182CE;
      }
    }
    
    &[type="button"] {
      background: #DC2626;
      color: white;
      
      &:hover {
        background: #B91C1C;
      }
    }
  }
`;
