import { useActionState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, Paper, CircularProgress 
} from '@mui/material'; // Importamos componentes MUI

const mockUsers = {
  'admin@correo.com': { password: '123', role: 'admin' },
  'usuario@correo.com': { password: '123', role: 'user' },
  'vendedor2@correo.com': { password: '123', role: 'admin' },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userAccount = mockUsers[email];

      if (userAccount && userAccount.password === password) {
        login({ email, role: userAccount.role });
        navigate('/pos'); // Siempre redirigimos al punto de venta
        return null;
      } else {
        return 'Correo electrónico o contraseña incorrectos.';
      }
    },
    null
  );

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: 'background.default' // Fondo oscuro de la app
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Prueba con: <b>admin@correo.com</b> (pass: 123) o <b>usuario@correo.com</b> (pass: 123)
        </Typography>
        <form action={submitAction}>
          <TextField
            label="Correo Electrónico"
            type="email"
            id="email"
            name="email"
            fullWidth
            margin="normal"
            required
            variant="outlined" // Puedes probar "filled" o "standard"
          />
          <TextField
            label="Contraseña"
            type="password"
            id="password"
            name="password"
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3, py: 1.5 }} 
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;