import { Mail } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  FeedbackMessage,
  Form,
  InputContainer,
  Title
} from './styles';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  // Novos estados para código e nova senha
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warn('Informe seu e-mail');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        let errorMsg = 'Erro ao solicitar recuperação de senha.';
        try {
          const data = await response.json();
          errorMsg = data?.erro || data?.message || errorMsg;
        } catch {}
        toast.error(errorMsg + ` (código: ${response.status})`);
        setLoading(false);
        return;
      }
      setSent(true);
      toast.success('Se o e-mail existir, você receberá instruções para redefinir sua senha.');
    } catch (err) {
      toast.error('Erro ao solicitar recuperação de senha. ' + (err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Nova função para enviar código e nova senha
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      toast.warn('Preencha o código e a nova senha.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo: code, novaSenha: newPassword })
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data?.erro || 'Erro ao redefinir a senha.');
        setLoading(false);
        return;
      }
      setResetDone(true);
      toast.success('Senha redefinida com sucesso!');
    } catch {
      toast.error('Erro ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  // Redireciona após redefinir a senha com sucesso
  useEffect(() => {
    if (resetDone) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 segundos
      return () => clearTimeout(timer);
    }
  }, [resetDone, navigate]);

  return (
    <Container>
      <Title>Esqueci minha senha</Title>
      {!sent && !resetDone && (
        <Form onSubmit={handleSubmit}>
          <InputContainer>
            <label htmlFor="email">E-mail:</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '10px', color: '#666' }} />
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ paddingLeft: '35px' }}
              />
            </div>
          </InputContainer>
          <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '10px', borderRadius: 4, background: 'rgb(30, 148, 138)', color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </Form>
      )}
      {sent && !resetDone && (
        <Form onSubmit={handleResetPassword}>
          <InputContainer>
            <label htmlFor="code">Código recebido:</label>
            <input
              id="code"
              type="text"
              placeholder="Digite o código"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </InputContainer>
          <InputContainer>
            <label htmlFor="newPassword">Nova senha:</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </InputContainer>
          <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '10px', borderRadius: 4, background: 'rgb(30, 148, 138)', color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </Form>
      )}
      {resetDone && (
        <FeedbackMessage>
          <p>Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.</p>
        </FeedbackMessage>
      )}
    </Container>
  );
}
