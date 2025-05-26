/* eslint-disable no-unused-vars */
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
          <Input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* Se quiser permitir escolha do papel, descomente abaixo */}
          {/* <Input
            type="text"
            name="papel"
            placeholder="Papel"
            value={form.papel}
            onChange={handleChange}
            required
          /> */}
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
