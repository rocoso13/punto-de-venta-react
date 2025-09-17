import axios from 'axios';

// Creamos una instancia de Axios con la URL base de nuestro backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8090/api', // La URL de tu backend Spring Boot
});

// Esta función nos permitirá "inyectar" la lógica de logout desde nuestro AuthContext.
export const setupInterceptors = (logout) => {
  
  // Interceptor de peticiones (añade el token si existe)
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de respuestas (maneja los errores de token expirado)
  apiClient.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, no hace nada.
    (error) => {
      // Si la respuesta es un error 401 o 403, significa que el token es inválido o expiró.
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log("Token expirado o inválido. Cerrando sesión automáticamente...");
        logout(); // Llama a la función de logout para limpiar la sesión.
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;