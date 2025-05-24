import styled from 'styled-components';
import {
  Layout,
  Sidebar,
  MainContent,
  Header,
  MenuItem,
  UserInfo,
  LogoutButton
} from '../Dashboard/styles';

export {
  Layout,
  Sidebar,
  MainContent,
  Header,
  MenuItem,
  UserInfo,
  LogoutButton
};

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
  background: rgb(0, 4, 14);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  color: rgb(0, 21, 255);
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  color: rgb(0, 21, 255);
`;
