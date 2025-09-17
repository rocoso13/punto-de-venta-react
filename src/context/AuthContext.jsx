import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient, { setupInterceptors } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Usamos useCallback para que la función logout no se recree en cada render.
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    // Redirigimos al login para una experiencia de usuario fluida.
    window.location.href = '/login';
  }, []);

  // Este useEffect se ejecuta solo una vez y configura todo.
  useEffect(() => {
    // Aquí conectamos nuestro interceptor con la función logout.
    setupInterceptors(logout);
    
    const token = localStorage.getItem('jwt_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [logout]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, name, role } = response.data;
      const userData = { name, email, role };

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error("Error en el login:", error);
      return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};