import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-container">
      <h2>Panel de Administración</h2>
      <p>¡Bienvenido, {user?.email}! Tienes el rol de <b>{user?.role}</b>.</p>
      <p>Este contenido solo es visible para administradores.</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default AdminPanel;