import React from 'react';
import {
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from '../../components/MenuSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Header,
  Layout,
  LogoutButton,
  MainContent,
  Table,
  TableContainer,
  Td,
  Th,
  Title,
  UserInfo
} from './styles';

const Itens = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Layout>
      <MenuSidebar />
      <MainContent>
        <Header>
          <h1>Produtos</h1>
          <UserInfo>
            <FaUser size={20} />
            <span style={{ color: '#fff', marginRight: '10px' }}>
              {user?.nome ? `Olá, ${user.nome}` : 'Carregando...'}
            </span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt size={20} />
              Sair
            </LogoutButton>
          </UserInfo>
        </Header>

        <Container>
          <Title>Gerenciamento de Itens</Title>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Código</Th>
                  <Th>Nome</Th>
                  <Th>Quantidade</Th>
                  <Th>Preço</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>001</Td>
                  <Td>Item Exemplo</Td>
                  <Td>10</Td>
                  <Td>R$ 99,90</Td>
                  <Td>
                    {/* Aqui virão os botões de ação */}
                  </Td>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </Container>
      </MainContent>
    </Layout>
  );
};

export default Itens;
