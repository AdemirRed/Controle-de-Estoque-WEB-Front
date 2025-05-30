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
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
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
