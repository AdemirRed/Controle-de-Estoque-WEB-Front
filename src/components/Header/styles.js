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

export const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 15px;

  &::after {
    content: '${props => props.count || ''}';
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    display: ${props => props.count ? 'block' : 'none'};
  }
`;

export const NotificationPanel = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: var(--dark-surface);
  border: 1px solid rgba(18, 181, 187, 0.3);
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  box-shadow: 0 0 20px rgba(18, 181, 187, 0.29);
  z-index: 1000;

  .notification-item {
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }
`;
