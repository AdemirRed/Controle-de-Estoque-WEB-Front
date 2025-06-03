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
`;

export const MainContent = styled.div`
  flex: 1;
  background: transparent;
`;

export const Sidebar = styled.div`
  width: 250px;
  min-height: 100vh;
  background: #181c24;
  animation: ${subtleGradient} 24s linear infinite;
  padding: 20px;
  box-shadow: 2px 0 8px #10131a33;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s;
  z-index: 1200;

  @media (max-width: 900px) {
    width: 180px;
    padding: 10px;
  }
  @media (max-width: 600px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
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

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  background: transparent;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #00eaff;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #10131a;
`;

export const TableContainer = styled.div`
  width: 100%;
  background: #232a36;
  border-radius: 12px;
  box-shadow: 0 2px 16px #10131a33;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #232a36;
  color: #00eaff;
  font-weight: 700;
  background-color: #181c24;
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #232a36;
  color: #eaf6fb;

  &.nome-item {
    font-weight: 600;
    font-size: 1.1em;
    color: #00eaff;
  }

  &:last-child {
    display: flex;
    gap: 4px;
    justify-content: flex-start;
    align-items: center;
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

export const AddButton = styled.button`
  background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px #00b4d855;
  }

  svg {
    font-size: 16px;
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
  background-color: #232a36;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 2px 16px #10131a33;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #eaf6fb;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #232a36;
  border-radius: 6px;
  background-color: #181c24;
  color: #eaf6fb;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #00eaff;
    outline: none;
    box-shadow: 0 0 8px #00eaff44;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #232a36;
  border-radius: 6px;
  background-color: #181c24;
  color: #eaf6fb;
  min-height: 100px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  button {
    min-width: 100px;
  }
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

  svg {
    font-size: 14px;
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

  &:last-child {
    margin-bottom: 24px;
  }
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
