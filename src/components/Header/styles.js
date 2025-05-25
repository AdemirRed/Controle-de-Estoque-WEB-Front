import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1f2937;
  color: white;
  
  h1 {
    font-size: 24px;
    margin: 0;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #dc3545;
  }
`;
