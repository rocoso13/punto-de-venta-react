// src/components/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Obtenemos el usuario y la función de logout.
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llamamos a la función de cerrar sesión.
    navigate('/'); // Enviamos al usuario a la página de inicio.
  };

  return (
    <div className="page-container">
      <h2>Dashboard del Usuario</h2>
      {/* 'user?' es una forma segura de acceder a 'user.email'. Si 'user' no existe, no dará error. */}
      {user && <p>Bienvenido, {user.email}! Tu rol es: <b>{user.role}</b></p>}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;