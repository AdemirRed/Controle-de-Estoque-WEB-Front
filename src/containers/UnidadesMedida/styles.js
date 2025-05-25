import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: rgb(0, 21, 255);
`;

export const TableContainer = styled.div`
  width: 100%;
  background: #1f2937;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto; // Adicionar scroll horizontal
`;

export const Table = styled.table`
  width: 100%;
  min-width: 800px; // Largura mínima para evitar compressão
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #374151;
  color: #fff;
  font-weight: 600;
  background-color: #111827;
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #374151;
  color: #fff;
  
  &:last-child {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1557b0 0%, #083378 100%);
    transform: translateY(-2px);
  }
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

export const Form = styled.form`
  background-color: #1f2937;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #fff;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #374151;
  border-radius: 4px;
  background-color: #111827;
  color: white;
  
  &:focus {
    border-color: #1a73e8;
    outline: none;
  }
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
