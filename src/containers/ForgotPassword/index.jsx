import { Mail } from 'lucide-react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer e controle de reenvio
  const [codeExpiresIn, setCodeExpiresIn] = useState(300); // 5 minutos
  const [resendDelay, setResendDelay] = useState(30); // 30s inicial
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendTimeLeft, setResendTimeLeft] = useState(resendDelay);
  const resendTimerRef = useRef(null);
  const codeTimerRef = useRef(null);

  const navigate = useNavigate();

  // Timer de expiração do código
  useEffect(() => {
    if (!sent || resetDone) return;
    if (codeTimerRef.current) clearInterval(codeTimerRef.current);
    codeTimerRef.current = setInterval(() => {
      setCodeExpiresIn(prev => {
        if (prev <= 1) {
          clearInterval(codeTimerRef.current);
          toast.warn('O código expirou. Solicite um novo código.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(codeTimerRef.current);
  }, [sent, resetDone]);

  // Timer para liberar botão de reenviar código
  useEffect(() => {
    if (!sent || resetDone) return;
    setResendTimeLeft(resendDelay);
    setCanResend(false);
    if (resendTimerRef.current) clearTimeout(resendTimerRef.current);
    if (resendCount < 3) { // alterado de 5 para 3
      resendTimerRef.current = setInterval(() => {
        setResendTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(resendTimerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(resendTimerRef.current);
  }, [sent, resendDelay, resetDone, resendCount]);

  useEffect(() => {
    return () => {
      clearInterval(codeTimerRef.current);
      clearInterval(resendTimerRef.current);
    };
  }, []);

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
      const data = await response.json();
      if (!response.ok) {
        let errorMsg = 'Erro ao solicitar recuperação de senha.';
        errorMsg = data?.erro || data?.mensagem || data?.message || errorMsg;
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
      if (data?.mensagem === 'E-mail não cadastrado ou incorreto.') {
        toast.error(data.mensagem);
        setLoading(false);
        return;
      }
      setSent(true);
      setResendCount(0);
      setResendDelay(30);
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.');
    } catch (err) {
      toast.error('Erro ao solicitar recuperação de senha. ' + (err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || resendCount >= 3) return; // alterado de 5 para 3
    setLoading(true);
    try {
      const response = await fetch('/api/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMsg = 'Erro ao reenviar código.';
        errorMsg = data?.erro || data?.mensagem || data?.message || errorMsg;
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
      toast.success('Novo código enviado! Verifique seu e-mail.');
      // Reinicia o timer de expiração do código corretamente
      setCodeExpiresIn(300);
      if (codeTimerRef.current) clearInterval(codeTimerRef.current);
      codeTimerRef.current = setInterval(() => {
        setCodeExpiresIn(prev => {
          if (prev <= 1) {
            clearInterval(codeTimerRef.current);
            toast.warn('O código expirou. Solicite um novo código.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setResendCount(prev => prev + 1);
      setResendDelay(prev => Math.min(prev * 2, 480));
      setCanResend(false);
      setResendTimeLeft(Math.min(resendDelay * 2, 480));
    } catch (err) {
      toast.error('Erro ao reenviar código. ' + (err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      toast.warn('Preencha o código, a nova senha e a confirmação da senha.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warn('As senhas não coincidem.');
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

  useEffect(() => {
    if (resetDone) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [resetDone, navigate]);

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

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
            <div style={{ marginTop: 6, color: codeExpiresIn > 60 ? '#00eaff' : '#ff9800', fontSize: 13 }}>
              {codeExpiresIn > 0
                ? `O código expira em ${formatTime(codeExpiresIn)}`
                : 'O código expirou. Solicite um novo código.'}
            </div>
          </InputContainer>
          <InputContainer>
            <label htmlFor="newPassword">Nova senha:</label>
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
                  color: '#00eaff',
                  fontSize: 22,
                  position: 'absolute',
                  top: '9px',
                  right: '12px',
                  zIndex: 2
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                style={{ width: '100%', paddingRight: 38, marginTop: 0 }}
              />
            </div>
          </InputContainer>
          <InputContainer>
            <label htmlFor="confirmPassword">Confirmar nova senha:</label>
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
                onClick={() => setShowConfirmPassword(v => !v)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#00eaff',
                  fontSize: 22,
                  position: 'absolute',
                  top: '9px',
                  right: '12px',
                  zIndex: 2
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                style={{ width: '100%', paddingRight: 38, marginTop: 0 }}
              />
            </div>
          </InputContainer>
          <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '10px', borderRadius: 4, background: 'rgb(30, 148, 138)', color: '#fff', border: 'none', fontWeight: 600 }}>
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
          <div style={{ marginTop: 18, textAlign: 'center', color: '#00eaff', fontSize: 14 }}>
            Não recebeu o código?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || loading || resendCount >= 3} // alterado de 5 para 3
              style={{
                background: 'none',
                border: 'none',
                color: canResend && !loading && resendCount < 3 ? '#00eaff' : '#888', // alterado de 5 para 3
                textDecoration: 'underline',
                cursor: canResend && !loading && resendCount < 3 ? 'pointer' : 'not-allowed', // alterado de 5 para 3
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 4
              }}
            >
              Enviar novamente
            </button>
            {!canResend && resendCount < 3 && ( // alterado de 5 para 3
              <span style={{ marginLeft: 8, color: '#ff9800', fontSize: 13 }}>
                {`Aguarde ${resendTimeLeft}s`}
              </span>
            )}
            {resendCount >= 3 && ( // alterado de 5 para 3
              <span style={{ marginLeft: 8, color: '#ff4b4b', fontSize: 13 }}>
                Limite de reenvios atingido
              </span>
            )}
          </div>
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
