import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 32px auto;
  background: none;
  border-radius: 12px;
  padding: 0;
  box-shadow: none;
`;

export const RequestForm = styled.form`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #eaf6fb;
  font-size: 0.95rem;
  gap: 4px;
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
  margin: 0;
`;

export const RequestItem = styled.li`
  background: #181c24;
  border-radius: 8px;
  padding: 16px 18px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eaf6fb;
  box-shadow: 0 1px 8px #10131a22;
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
