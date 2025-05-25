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

  .lista-usuarios {
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
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #374151;
      }
      
      th {
        font-weight: 600;
        background: #111827;
        color: #fff;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        
        &:first-child {
          border-top-left-radius: 8px;
        }
        &:last-child {
          border-top-right-radius: 8px;
        }
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
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(66, 153, 225, 0.3);
        }

        // Adicione estilos específicos para o botão de excluir
        &[onClick*="handleDelete"] {
          background: #dc3545;
          
          &:hover {
            background: #c82333;
            box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    .lista-usuarios {
      padding: 1rem;
      overflow-x: auto;
      
      table {
        min-width: 600px;
      }
    }
  }
`;

export const Form = styled.form`
  background-color: #1f2937;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #374151;
    border-radius: 4px;
    background-color: #111827;
    color: white;
    margin-bottom: 15px;
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #4299E1;
      outline: none;
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }

  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #374151;
    border-radius: 4px;
    background-color: #111827;
    color: white;
    margin-bottom: 15px;
    transition: border-color 0.3s ease;
    cursor: pointer;
    
    &:focus {
      border-color: #4299E1;
      outline: none;
    }

    option {
      background-color: #111827;
      color: white;
    }
  }
  
  label {
    display: block;
    margin-bottom: 15px;
    color: #fff;
    font-weight: 500;
    
    input[type="checkbox"] {
      margin-right: 10px;
      accent-color: #4299E1;
    }

    span {
      display: block;
      margin-bottom: 5px;
    }
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
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(66, 153, 225, 0.3);
      }
    }
    
    &[type="button"] {
      background: #DC2626;
      color: white;
      
      &:hover {
        background: #B91C1C;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0;
    max-width: 100%;
    box-shadow: none;
  }
`;

export const DetailsContainer = styled.div`
  background-color: #1f2937;
  padding: 24px;
  border-radius: 12px;
  width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

export const DetailsHeader = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #374151;
`;

export const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #111827;
  border-radius: 6px;
`;

export const DetailsLabel = styled.span`
  color: rgb(255, 255, 255);
  font-weight: 600;
  width: 120px;
  flex-shrink: 0;
`;

export const DetailsValue = styled.span`
  color: #fff;
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
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #1557b0 0%, #083378 100%);
    }
  }
  
  &.secondary {
    background: linear-gradient(135deg, #dc3545 0%, #981b1b 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #bb2d3b 0%, #7c1616 100%);
    }
  }
`;
