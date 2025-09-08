// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  // 1. Obtenemos también el estado 'loading'.
  const { isAuthenticated, user, loading } = useAuth();

  // 2. Si estamos en el proceso de carga, mostramos un mensaje.
  // El Guardia espera aquí hasta que 'loading' sea 'false'.
  if (loading) {
    return (
      <div className="page-container">
        <h2>Verificando sesión...</h2>
      </div>
    );
  }

  // 3. Una vez que 'loading' es 'false', la lógica de siempre se ejecuta.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const isAuthorized = allowedRoles.includes(user.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;