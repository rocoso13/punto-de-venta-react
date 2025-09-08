// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const AuthContext = createContext(null);
const CINCO_MINUTOS = 5 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. Añadimos un nuevo estado para saber si estamos verificando la sesión inicial.
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef();
  const navigate = useNavigate(); // Usaremos navigate para redirigir desde el contexto

  // La función login no cambia mucho.
  const login = (userData) => {
    setUser(userData);
    const expiryTime = new Date().getTime() + CINCO_MINUTOS;
    localStorage.setItem('session', JSON.stringify({ user: userData, expiry: expiryTime }));
    logoutTimer.current = setTimeout(() => {
        // Envolvemos el logout en una función para poder pasarle navigate
        handleLogout(true); // true indica que es un logout automático
    }, CINCO_MINUTOS);
  };

  // Renombramos logout a handleLogout para más claridad
  const handleLogout = (isAutoLogout = false) => {
    setUser(null);
    localStorage.removeItem('session');
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    // Si es un logout automático, informamos al usuario y lo redirigimos
    if (isAutoLogout) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        navigate('/login');
    }
  };

  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    
    try {
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          const now = new Date().getTime();

          if (now < parsedSession.expiry) {
            setUser(parsedSession.user);
            const remainingTime = parsedSession.expiry - now;
            logoutTimer.current = setTimeout(() => handleLogout(true), remainingTime);
          } else {
            localStorage.removeItem('session');
          }
        }
    } catch (error) {
        console.error("Error al procesar la sesión:", error);
        localStorage.removeItem('session');
    } finally {
        // 2. Una vez que hemos terminado de verificar, ponemos 'loading' en 'false'.
        setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  // 3. Pasamos 'loading' y la función 'handleLogout' renombrada al value del Provider.
  return (
    <AuthContext.Provider value={{ user, loading, login, logout: handleLogout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};