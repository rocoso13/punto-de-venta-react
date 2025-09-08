import React, { createContext, useState, useContext } from 'react';
import { products as mockProducts } from '../mockData';

// 1. Creamos el contexto
const ProductContext = createContext();

// 2. Creamos el "Proveedor" que contendrá el estado y las funciones
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);

  // Función para actualizar la lista completa de productos (usada en Inventario)
  const updateProductList = (newProductList) => {
    setProducts(newProductList);
  };

  // Función para reducir el stock después de una venta (usada en Ventas)
  const reduceStock = (cart) => {
    setProducts(prevProducts => {
      // Creamos una copia del array de productos para no mutar el estado directamente
      const updatedProducts = prevProducts.map(p => ({...p}));
      
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.product.id);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock -= cartItem.quantity;
        }
      });
      return updatedProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, updateProductList, reduceStock }}>
      {children}
    </ProductContext.Provider>
  );
};

// 3. Creamos un Hook personalizado para usar el contexto fácilmente
export const useProducts = () => {
  return useContext(ProductContext);
};