import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="page-container">
      <h2>Acceso Denegado</h2>
      <p>No tienes los permisos necesarios para acceder a esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default Unauthorized;