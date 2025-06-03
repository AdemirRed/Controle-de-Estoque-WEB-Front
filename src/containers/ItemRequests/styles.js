import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 32px auto;
  background: none;
  border-radius: 12px;
  padding: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #eaf6fb;
  font-size: 0.95rem;
  gap: 6px;
  
  `;

export const Input = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #00eaff44;
  background: #181c24;
  color: #eaf6fb;
  margin-top: 2px;
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

export const RequestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1100px;
  justify-items: center;
  justify-content: center;
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
  width: 85%;
  max-width: 350px;
  min-height: 180px;
  margin: 0px auto;

  &:hover {
    box-shadow: 0 8px 36px 0 #00eaff22;
    transform: translateY(-2px) scale(1.03);
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: bold;
  background: ${({ status }) =>
    status === 'aprovado'
  ? '#388e3c'
  : status === 'rejeitado'
  ? '#c91407'
  : '#f57c00'};
  color: #fff;
  margin-right: 8px;
  `;

export const Select = styled.select`
  background: #232a36;
  color: #eaf6fb;
  border: 1px solid #00eaff44;
  border-radius: 6px;
  padding: 6px 10px;
  margin-left: 8px;
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
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'relative')};
  top: ${({ $isMobile }) => ($isMobile ? 0 : 'unset')};
  left: ${({ $isMobile }) => ($isMobile ? 0 : 'unset')};
  height: ${({ $isMobile }) => ($isMobile ? '100vh' : 'unset')};
  box-shadow: ${({ $isMobile }) => ($isMobile ? '2px 0 16px #0008' : 'unset')};
`;

export const CloseSidebarButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #00eaff;
  font-size: 28px;
  display: ${({ $isMobile }) => ($isMobile ? 'flex' : 'none')};
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
  padding: 0;
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

export const ActionButton = styled.button`
  background: ${({ $bgColor }) => $bgColor || '#388e3c'};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
`;
