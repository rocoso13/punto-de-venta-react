import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export const usePagination = (endpoint) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Las páginas en el backend empiezan en 0
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (currentPage) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      // Enviamos los parámetros de paginación al backend
      const response = await apiClient.get(endpoint, {
        params: {
          page: currentPage,
          size: 10, // 10 elementos por página, puedes hacerlo configurable
        },
      });
      
      const responseData = response.data;
      setData(responseData.content); // 'content' contiene los items de la página
      setTotalPages(responseData.totalPages); // 'totalPages' viene del backend
      setPage(responseData.number); // 'number' es la página actual
    } catch (error) {
      console.error(`Error al cargar datos de ${endpoint}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, isAuthenticated]);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);
  
  const goToPage = (newPage) => {
    // El componente de MUI devuelve la página empezando en 1, lo ajustamos a 0
    setPage(newPage - 1);
  };

  return { data, loading, page: page + 1, totalPages, goToPage, refetch: () => fetchData(0) };
};