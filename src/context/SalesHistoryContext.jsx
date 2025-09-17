import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const SalesHistoryContext = createContext();

export const SalesHistoryProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchSales = useCallback(async () => {
    if (isAuthenticated) {
      try {
        console.log("va a entrar a la peticiohn");
        const response = await apiClient.get('/sales/history');
        console.log("salio");
        const data = response.data;
        console.log("esto trae la respuesta : ", data);
        

        if (Array.isArray(data.content)) {
          setSales(data.content);
        } else {
          console.error("La respuesta de la API para el historial de ventas no es un array:", data);
          setSales([]);
        }
      } catch (error) {
        console.error("Error al cargar el historial de ventas:", error);
        setSales([]);
      }
    } else {
      setSales([]);
    }
  }, [isAuthenticated]); // 3. La dependencia de useCallback es 'isAuthenticated'

  const addSale = async (newSaleData) => {
    try {
      await apiClient.post('/sales', newSaleData);
      fetchSales();
    } catch (error) {
      console.error("Error al crear la venta:", error);
      throw error;
    }
  };


  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SalesHistoryContext.Provider value={{ sales, fetchSales, addSale }}>
      {children}
    </SalesHistoryContext.Provider>
  );
};

export const useSalesHistory = () => {
  return useContext(SalesHistoryContext);
};