import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 0;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  background-color: #0a1929;
  color: #f3f6f9;
  overflow-x: hidden;

  @media (max-width: 900px) {
    padding: 10px 2vw;
    margin-top: 56px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 1vw;
  }
`;

export const FormWrapper = styled.div`
  background: #132040;
  padding: 32px 32px 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.25);
  width: 100%;
  box-sizing: border-box;
  color: #f3f6f9;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 600px;
  margin: 0 auto;

  .MuiInputBase-root,
  .MuiOutlinedInput-root,
  .MuiSelect-select,
  .MuiInputLabel-root,
  .MuiFormLabel-root {
    color: #f3f6f9 !important;
    background: #1a2636 !important;
    border-radius: 6px !important;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #00f2fa !important;
  }

  .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #00f2fa !important;
    box-shadow: 0 0 0 2px #00f2fa33;
  }

  .MuiInputLabel-root {
    color: #b2bac2 !important;
  }

  .MuiInputBase-input {
    color: #f3f6f9 !important;
  }

  .MuiSelect-icon {
    color: #00f2fa !important;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

export const PedidoCard = styled.div`
  border: 1px solid #00f2fa33;
  background: #132040;
  color: #f3f6f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 0 15px #00f2fa22;
`;

export const ListaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EditModeContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #00f2fa33;
  border-radius: 8px;
  background: #1a2636;
`;

// Detalhes
export const DetailsContainer = styled.div`
  background: #132040;
  padding: 32px;
  border-radius: 12px;
  color: #f3f6f9;
`;

export const DetailsHeader = styled.h2`
  color: #00f2fa;
  margin-bottom: 24px;
  border-bottom: 1px solid #00f2fa33;
  padding-bottom: 8px;
`;

export const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #22304a;
`;

export const DetailsLabel = styled.span`
  font-weight: bold;
  min-width: 150px;
  color: #b2bac2;
`;

export const DetailsValue = styled.span`
  flex: 1;
  color: #f3f6f9;
`;

export const ActionButton = styled.button`
  background: ${({ bgColor }) => bgColor || '#388e3c'};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #00eaff 0%, #0077b6 100%);
  border: none;
  color: #fff;
  padding: 10px 22px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 22px;
  &:hover {
    background: linear-gradient(135deg, #0077b6 0%, #00eaff 100%);
    transform: translateY(-2px) scale(1.04);
  }
`;

export const Input = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #00eaff44;
  background: #181c24;
  color: #eaf6fb;
  margin-top: 2px;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #eaf6fb;
  font-size: 0.95rem;
  gap: 6px;
`;

export const RequestForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  grid-column: 1 / -1;

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: end;
  }
`;

export const OrDivider = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  margin: 8px 0;
  color: #b2bac2;
  font-size: 0.9rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #00eaff33;
    z-index: 1;
  }

  span {
    background: #132040;
    padding: 0 16px;
    position: relative;
    z-index: 2;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const Select = styled.select`
  background: #232a36;
  color: #eaf6fb;
  border: 1px solid #00eaff44;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 2px;
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: #232a36;
    color: #eaf6fb;
  }
`;

export const RequestItem = styled.li`
  background: #132040;
  border-radius: 12px;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #eaf6fb;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
  border: 1px solid #00eaff33;
  transition: box-shadow 0.2s, transform 0.2s;
  min-width: 0;
  width: 100%;
  max-width: 350px;
  min-height: 180px;
  margin: 0px auto;

  &:hover {
    box-shadow: 0 8px 36px 0 #00eaff22;
    transform: translateY(-2px) scale(1.03);
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 16px 20px;
    min-height: 160px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    min-height: 140px;
  }
`;

export const RequestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 100%;
  width: 100%;
  justify-items: center;
  justify-content: center;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 8px;
  }
`;

export const SidebarButton = styled.button`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 3000;
  background: #232a36;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: #00eaff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #0008;
  cursor: pointer;
`;

export const SidebarContainer = styled.div`
  min-width: 250px;
  max-width: 300px;
  width: 100%;
  transition: all 0.3s;
  z-index: 200;
  background: #232a36;
  position: ${({ isMobile }) => (isMobile ? 'fixed' : 'relative')};
  top: ${({ isMobile }) => (isMobile ? 0 : 'unset')};
  left: ${({ isMobile }) => (isMobile ? 0 : 'unset')};
  height: ${({ isMobile }) => (isMobile ? '100vh' : 'unset')};
  box-shadow: ${({ isMobile }) => (isMobile ? '2px 0 16px #0008' : 'unset')};
`;

export const CloseSidebarButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #00eaff;
  font-size: 28px;
  display: ${({ isMobile }) => (isMobile ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3001;
`;

export const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  padding: 0;
  overflow-x: hidden;
`;

export const NewRequestContainer = styled.div`
  background: #132040;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.25);
  margin-bottom: 32px;
  max-width: 600px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RequestTitle = styled.h2`
  color: #00eaff;
  margin-bottom: 18px;
  text-align: center;
`;

export const RequestListTitle = styled.h3`
  color: #00eaff;
  margin: 32px 0 16px 0;
  border-bottom: 1px solid #00eaff33;
  padding-bottom: 8px;
  font-weight: 600;
  font-size: 1.2rem;
  text-align: center;
  width: 100%;
  max-width: 700px;
`;

export const RequestItemStatus = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  background: ${({ statusColor }) => statusColor || '#f57c00'};
  color: #fff;
  margin-right: 10px;
  font-size: 0.95em;
`;

export const RequestItemActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  justify-content: flex-end;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: #132040;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
  color: #f3f6f9;
`;

export const ModalTitle = styled.h3`
  color: #00eaff;
  margin-bottom: 24px;
  text-align: center;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const ModalButton = styled.button`
  background: ${({ variant }) => 
    variant === 'danger' ? '#c91407' : 
    variant === 'secondary' ? '#6c757d' : '#388e3c'};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #00eaff44;
  background: #181c24;
  color: #eaf6fb;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 8px;
  box-sizing: border-box;

  &::placeholder {
    color: #b2bac2;
  }

  &:focus {
    outline: none;
    border-color: #00eaff;
    box-shadow: 0 0 0 2px #00eaff33;
  }
`;
