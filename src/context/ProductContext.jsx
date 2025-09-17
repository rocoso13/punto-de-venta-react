import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // 1. Asegúrate de importar useCallback
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();

  // 2. ENVOLVEMOS LA FUNCIÓN ASÍNCRONA CON useCallback
  const fetchProducts = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.get('/products');
        if (response.data && Array.isArray(response.data.content)) {
          setProducts(response.data.content);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    } else {
      setProducts([]);
    }
  }, [isAuthenticated]); // 3. La dependencia de useCallback es 'isAuthenticated'

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // 4. La dependencia de useEffect es la función memorizada

  return (
    <ProductContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};