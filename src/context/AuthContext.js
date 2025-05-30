import { login } from '../services/authService';

// ...existing code...

const signIn = async ({ email, password }) => {
  const response = await login({ email, password });
  // ...existing code...
};

// ...existing code...
