import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav style={{ background: '#f0f0f0', padding: '1rem', marginBottom: '1rem' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
        <li><Link to="/">Inicio</Link></li>
        
        {/* Enlace para todos los usuarios autenticados */}
        {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
        
        {/* Enlace solo para administradores */}
        {isAuthenticated && user?.role === 'admin' && (
          <li><Link to="/admin">Panel Admin</Link></li>
        )}
        
        {/* Enlace de Login/Logout */}
        {!isAuthenticated && <li><Link to="/login">Iniciar Sesión</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;