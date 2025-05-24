 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    Button,
    Container,
    Form,
    Input,
    LoginBox,
    RememberMeContainer // Adicionar este import
    ,

    Title
} from './styles';

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [credentials, setCredentials] = useState({
    email: localStorage.getItem('email') || '',
    password: '',
    rememberMe: localStorage.getItem('rememberMe') === 'true'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      toast.warn('Por favor, preencha todos os campos');
      return;
    }

    try {
      await auth.signIn(credentials);
      toast.success('Redirecionando para o Dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>OnnMoveis</Title>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#4a90e2', 
          fontSize: '18px',
          marginBottom: '10px' 
        }}>
          Sistema de Controle de Estoque
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#888', 
          fontSize: '14px',
          marginBottom: '20px' 
        }}>
          Faça login para acessar o sistema
        </p>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Senha"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <RememberMeContainer>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={(e) => handleChange({
                target: {
                  name: 'rememberMe',
                  value: e.target.checked
                }
              })}
            />
            <label htmlFor="rememberMe">Lembrar-me</label>
          </RememberMeContainer>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <Button type="submit">Entrar</Button>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;
