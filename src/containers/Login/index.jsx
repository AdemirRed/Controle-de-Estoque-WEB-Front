import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
    Button,
    Container,
    Form,
    Input,
    LoginBox,
    RememberMeContainer,
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
  const [showPassword, setShowPassword] = useState(false);

  // Redireciona para o dashboard se já estiver logado
  useEffect(() => {
    if (auth.user) {
      navigate('/dashboard');
    }
  }, [auth.user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      // Salva ou remove email e rememberMe do localStorage
      if (credentials.rememberMe) {
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('rememberMe');
      }
      toast.success('Redirecionando para o Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200); // 1.2 segundos de delay
    } catch (err) {
      if (err?.response?.status === 401) {
        setError('Usuário ou senha incorretos!');
      } else {
        setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
      }
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Contole Estoque</Title>
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
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <label htmlFor="password" style={{ color: '#fff', fontSize: 14, marginBottom: 2 }}>Senha:</label>
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              marginBottom: 2,
              marginTop: 2
            }}>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4a90e2',
                  fontSize: 22,
                  position: 'absolute',
                  top: '9px', // centralizado
                  right: '12px',
                  zIndex: 2
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Senha"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ width: '100%', paddingRight: 38, marginTop: 0 }}
              />
            </div>
          </div>
          <RememberMeContainer>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Lembrar-me</label>
          </RememberMeContainer>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <Button type="submit">Entrar</Button>
          <Button
            type="button"
            style={{ background: 'transparent', color: '#4a90e2', marginTop: 10 }}
            onClick={() => navigate('/register')}
          >
            Criar uma conta
          </Button>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#4a90e2',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 14,
                padding: 0
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Esqueci minha senha?
            </button>
          </div>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;
