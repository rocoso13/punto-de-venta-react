import React, { createContext, useState, useContext } from 'react';
import { salesHistory as mockSales } from '../mockData';

const SalesHistoryContext = createContext();

export const SalesHistoryProvider = ({ children }) => {
  const [sales, setSales] = useState(mockSales);

  // Función para añadir una nueva venta al historial
  const addSale = (newSaleData) => {
    const sale = {
      id: `SALE-${String(Date.now()).slice(-4)}`, // ID único simple
      date: new Date().toISOString(),
      ...newSaleData, // Esto incluirá 'items' y 'total'
    };
    setSales(prevSales => [sale, ...prevSales]);
  };

  return (
    <SalesHistoryContext.Provider value={{ sales, addSale }}>
      {children}
    </SalesHistoryContext.Provider>
  );
};

export const useSalesHistory = () => {
  return useContext(SalesHistoryContext);
};