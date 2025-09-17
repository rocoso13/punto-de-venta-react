import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    } else {
      setUsers([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider value={{ users, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UserContext);
};