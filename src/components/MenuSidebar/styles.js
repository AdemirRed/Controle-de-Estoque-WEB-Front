import styled from 'styled-components';

export const Sidebar = styled.div`
  width: 250px;
  background: var(--dark-surface);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const MenuItem = styled.div`
  padding: 12px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgb(0, 4, 14);
  color: rgb(0, 21, 255);
  
  &:hover {
    background: rgba(196, 196, 196, 0.1);
  }

  &.active {
    background: rgb(0, 72, 255);
    color: rgb(0, 0, 0);
  }
`;

export const Logo = styled.h2`
  color: white;
  margin-bottom: 20px;
  text-align: center;
`;
