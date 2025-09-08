import React, { createContext, useState, useContext } from 'react';
import { clients as mockClients } from '../mockData'; // Importaremos los clientes de mockData

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(mockClients);

  const updateClientList = (newClientList) => {
    setClients(newClientList);
  };

  return (
    <ClientContext.Provider value={{ clients, updateClientList }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  return useContext(ClientContext);
};