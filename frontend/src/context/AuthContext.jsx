import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('archivalia_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('archivalia_user');
    
    if (storedToken) {
      try {
        setToken(storedToken);
        if (storedUserStr) {
          try {
            setUser(JSON.parse(storedUserStr));
          } catch (e) {
            // ignore parse errors
          }
        }
        
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        localStorage.setItem('archivalia_user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to restore authentication state:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('archivalia_user');
        setToken(null);
        setUser(null);
      }
    } else {
      // Clean up if token is missing but user exists
      localStorage.removeItem('archivalia_user');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token: newToken, username, role } = response;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      localStorage.setItem('archivalia_user', JSON.stringify(userData));
    } catch {
      const fallbackUser = { username, role };
      setUser(fallbackUser);
      localStorage.setItem('archivalia_user', JSON.stringify(fallbackUser));
    }
    
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('archivalia_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      role: user?.role || null,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
