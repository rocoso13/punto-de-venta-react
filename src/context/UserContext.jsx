import React, { createContext, useState, useContext } from 'react';
import { users as mockUsers } from '../mockData'; // Importaremos los usuarios de mockData

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);

  const updateUserList = (newUserList) => {
    setUsers(newUserList);
  };

  return (
    <UserContext.Provider value={{ users, updateUserList }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UserContext);
};