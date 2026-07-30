import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem('oms_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('oms_token'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (name, password, restaurantId) => {
    // Pass restaurantId to the API — backend validates and includes it in token
    const data = await api.login(name, password, restaurantId);
    localStorage.setItem('oms_token', data.token);
    setUser(data.user);
    // Show subscription warning if backend sends one (expiring soon)
    if (data.warning) {
      console.warn('[OMS]', data.warning);
    }
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