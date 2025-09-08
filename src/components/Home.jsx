import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: 'background.default', // Fondo oscuro de la app
        p: 3
      }}
    >
      <Typography variant="h3" component="h1" sx={{ color: 'text.primary', mb: 2 }}>
        ¡Bienvenido a BERRY POS!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Tu sistema de punto de venta moderno y eficiente.
      </Typography>
      <Button component={Link} to="/login" variant="contained" size="large">
        Comenzar
      </Button>
    </Box>
  );
};
export default Home;