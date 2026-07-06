import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // restore session on page load if a token exists
  useEffect(() => {
    const token = localStorage.getItem('oms_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('oms_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (name, password) => {
    const data = await api.login(name, password);
    localStorage.setItem('oms_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('oms_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
