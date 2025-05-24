import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

// Configuração base do axios
const api = axios.create({
  baseURL: '/auth', // Usando o proxy configurado no vite.config.js
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async ({ email, password, rememberMe }) => {
    try {
      const response = await api.post('/sessao', {
        email,
        senha_hash: password // Alterado para "senha_hash" conforme esperado pelo backend
      });

      const { token, usuario } = response.data;

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Salvando em ambos os storages se rememberMe estiver ativo
        if (rememberMe) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(usuario));
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(usuario));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
        }
        
        setUser(usuario);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.response) {
        toast.error(error.response.data.erro || 'Credenciais inválidas');
        throw new Error(error.response.data.erro || 'Credenciais inválidas');
      }
      toast.error('Erro de conexão com o servidor');
      throw new Error('Erro de conexão com o servidor');
    }
  };

  const signOut = () => {
    // Guarda o email e o estado do rememberMe antes de limpar
    const savedEmail = localStorage.getItem('email');
    const rememberMe = localStorage.getItem('rememberMe');
    
    // Limpa as sessões
    sessionStorage.clear();
    localStorage.clear();
    
    // Restaura o email e rememberMe
    if (savedEmail) {
      localStorage.setItem('email', savedEmail);
      localStorage.setItem('rememberMe', rememberMe);
    }
    
    setUser(null);
    api.defaults.headers.Authorization = null;
    toast.info('Logout realizado com sucesso!');
  };

  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    
    // Verifica primeiro no localStorage se tiver rememberMe, senão no sessionStorage
    let token, savedUser;
    
    if (rememberMe) {
      token = localStorage.getItem('token');
      savedUser = localStorage.getItem('user');
    } else {
      token = sessionStorage.getItem('token');
      savedUser = sessionStorage.getItem('user');
    }
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
