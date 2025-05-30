/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
    Title
} from './styles';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    papel: 'usuario'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.password) {
      toast.warn('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await signUp(form);
      toast.success('Conta criada! Faça login.');
      navigate('/login');
    } catch (err) {
      // Erro já tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Criar Conta</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ width: '100%', paddingRight: 38, marginTop: 0 }}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
          <Button
            type="button"
            style={{ background: 'transparent', color: '#4a90e2', marginTop: 10 }}
            onClick={() => navigate('/login')}
          >
            Já tem conta? Entrar
          </Button>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Register;
