import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchClients = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.get('/clients');
        setClients(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    } else {
      setClients([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <ClientContext.Provider value={{ clients, fetchClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  return useContext(ClientContext);
};