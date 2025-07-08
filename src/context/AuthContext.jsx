import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

// Configuração base do axios usando a variável de ambiente
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/auth', // Usa a URL da API ou fallback para o proxy
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    timeout: 100000 // 100 segundos de timeout
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token') || sessionStorage.getItem('@App:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@App:token');
      localStorage.removeItem('@App:user');
      sessionStorage.removeItem('@App:token');
      sessionStorage.removeItem('@App:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lastCheck, setLastCheck] = useState(0);

  const signIn = async ({ email, password, rememberMe }) => {
    try {
      const response = await api.post('/sessao', {
        email,
        senha_hash: password
      });

      const { token, usuario } = response.data;
      
      //console.log('Dados do usuário:', usuario); // Debug

      if (token && usuario) {
        // Configurar o token no axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Criar objeto do usuário com todos os dados necessários
        const userData = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          papel: usuario.papel // Garantir que o papel está sendo salvo
        };

        // Armazenar dados
        if (rememberMe) {
          localStorage.setItem('@App:token', token);
          localStorage.setItem('@App:user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('@App:token', token);
          sessionStorage.setItem('@App:user', JSON.stringify(userData));
        }
        
        setUser(userData);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.response?.data?.erro || 'Erro ao fazer login');
      throw error;
    }
  };

  // Método para criar uma conta
  const signUp = async ({ nome, email, password, papel }) => {
    try {
      console.log('Tentando criar conta:', { nome, email, papel });
      console.log('URL base da API:', api.defaults.baseURL);
      
      const response = await api.post('/usuarios', {
        nome,
        email,
        senha_hash: password,
        papel
      });
      
      console.log('Resposta da criação de conta:', response.data);
      toast.success('Conta criada com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao criar conta:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method
      });
      
      let errorMessage = 'Erro ao criar conta';
      
      if (error.response?.status === 426) {
        errorMessage = 'Erro de conexão com o servidor (426 - Upgrade Required). Verifique se a API está funcionando corretamente.';
      } else if (error.response?.data?.erro) {
        errorMessage = error.response.data.erro;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status) {
        errorMessage = `Erro HTTP ${error.response.status}: ${error.response.statusText || 'Erro desconhecido'}`;
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    sessionStorage.removeItem('@App:token');
    sessionStorage.removeItem('@App:user');
    setUser(null);
    api.defaults.headers.common['Authorization'] = '';
    toast.info('Logout realizado com sucesso!');
  };

  // Função para verificar dados do usuário
  const checkUserData = async (forceUpdate = false) => {
    try {
      const token = localStorage.getItem('@App:token') || sessionStorage.getItem('@App:token');
      // Garante que storedUser seja um objeto válido ou um objeto vazio
      let storedUser = {};
      try {
        const userStr = localStorage.getItem('@App:user') || sessionStorage.getItem('@App:user') || '{}';
        storedUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
      }
      
      if (!token || !storedUser || !storedUser.id) {
        signOut();
        return;
      }

      // Usando a rota correta com o ID do usuário
      const response = await api.get(`/usuarios/${storedUser.id}`);
      const currentUser = response.data;

      if (!currentUser) {
        signOut();
        return;
      }

      // Verifica se os dados mudaram
      const userChanged = JSON.stringify(currentUser) !== JSON.stringify(storedUser);

      if (userChanged || forceUpdate) {
        //console.log('Dados do usuário atualizados:', currentUser);
        const userData = {
          id: currentUser.id,
          nome: currentUser.nome,
          email: currentUser.email,
          papel: currentUser.papel
        };

        setUser(userData);
        
        // Atualiza storage
        if (localStorage.getItem('@App:token')) {
          localStorage.setItem('@App:user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('@App:user', JSON.stringify(userData));
        }

        // Se o papel mudou, força recarregamento da página
        if (storedUser.papel !== currentUser.papel) {
          window.location.reload();
        }
      }

      setLastCheck(Date.now());
    } catch (error) {
      console.error('Erro ao verificar dados do usuário:', error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        signOut();
      }
    }
  };

  // Função para atualizar um item
  const handleUpdate = async (itemId, updatedData) => {
    try {
      const response = await api.put(`/itens/${itemId}`, updatedData);
      toast.success('Item atualizado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data,
        });
        toast.error(
          error.response.data?.message || 'Erro ao atualizar item. Tente novamente.'
        );
      } else {
        toast.error('Erro de conexão. Verifique sua rede.');
      }
      throw error;
    }
  };

  // Verificar dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        checkUserData();
      }
    }, 30 * 1000); // 30 segundos

    return () => clearInterval(interval);
  }, [user, lastCheck]);

  useEffect(() => {
    const loadStorageData = () => {
      try {
        // Tentar recuperar dados do localStorage primeiro
        const storageToken = localStorage.getItem('@App:token');
        const storageUserStr = localStorage.getItem('@App:user');
        
        // Se não encontrar, tentar do sessionStorage
        const sessionToken = sessionStorage.getItem('@App:token');
        const sessionUserStr = sessionStorage.getItem('@App:user');

        if (storageToken && storageUserStr) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
          try {
            setUser(JSON.parse(storageUserStr));
          } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
            signOut();
          }
        } else if (sessionToken && sessionUserStr) {
          api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
          try {
            setUser(JSON.parse(sessionUserStr));
          } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
            signOut();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados da sessão:', error);
        signOut();
      }
    };

    loadStorageData();
  }, []);

  // Verificar dados ao montar o componente
  useEffect(() => {
    const loadStorageData = async () => {
      const storageToken = localStorage.getItem('@App:token');
      const sessionToken = sessionStorage.getItem('@App:token');

      if (storageToken || sessionToken) {
        await checkUserData(true); // força atualização inicial
      }
    };

    loadStorageData();
  }, []);

  // Adiciona listener para eventos de foco da janela
  useEffect(() => {
    const handleFocus = () => {
      if (user && Date.now() - lastCheck > 5000) { // Evita verificações muito frequentes
        checkUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, lastCheck]);

  return (
    <AuthContext.Provider 
      value={{ 
        signed: !!user, 
        user, 
        signIn, 
        signOut,
        signUp, // Adiciona signUp ao contexto
        handleUpdate, // Adiciona handleUpdate ao contexto
        loading: false 
      }}
    >
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

export default api;
