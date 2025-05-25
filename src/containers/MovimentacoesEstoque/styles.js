import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.div`
  flex: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: rgb(0, 4, 14);
  color: rgb(0, 21, 255);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
`;

export const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ff4b4b 0%, #c91407 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ff3333 0%, #a31206 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(201, 20, 7, 0.3);
  }
`;

export const Container = styled.div`
  padding: 20px;
`;

export const FormContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: #1f2937;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  color: #fff;

  h2 {
    color: #fff;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  form {
    display: grid;
    gap: 15px;

    div {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      color: #fff;
      font-size: 0.9rem;
    }

    input, select, textarea {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #4b5563;
      background-color: #374151;
      color: #fff;

      &:focus {
        outline: none;
        border-color: #60a5fa;
      }
    }

    button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        transform: translateY(-2px);
      }
    }
  }
`;

export const ListContainer = styled.div`
  background: #1f2937;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  color: #fff;

  h2 {
    color: #fff;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #4b5563;
    }

    th {
      background-color: #374151;
      color: #fff;
      font-weight: 600;
    }

    td {
      color: #fff;
    }

    button {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        transform: translateY(-2px);
      }
    }
  }
`;
