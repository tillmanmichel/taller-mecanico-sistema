import { createContext, useContext, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario') || 'null'));

  async function login(email, password) {
    const { token, usuario } = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
  }

  function logout() {
    localStorage.clear();
    setUsuario(null);
  }

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
