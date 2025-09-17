import { useActionState } from 'react';
import { useAuth } from '../context/AuthContext';
// YA NO NECESITAMOS useNavigate
// import { useNavigate } from 'react-router-dom'; 
import { Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';

export default function Login() {
  const { login } = useAuth();
  // const navigate = useNavigate(); // YA NO SE USA

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');
      
      const result = await login(email, password);

      if (result.success) {
        // --- CAMBIO CLAVE AQUÍ ---
        // En lugar de usar navigate, forzamos una recarga a la página principal del POS.
        // Esto asegura que toda la aplicación se reinicie con el nuevo estado de autenticación.
        window.location.href = '/pos'; 
        return null;
      } else {
        return result.message || 'Correo electrónico o contraseña incorrectos.';
      }
    },
    null
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Usa tu cuenta de administrador o vendedor.
        </Typography>
        <form action={submitAction}>
          <TextField label="Correo Electrónico" type="email" id="email" name="email" fullWidth margin="normal" required />
          <TextField label="Contraseña" type="password" id="password" name="password" fullWidth margin="normal" required />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5 }} disabled={isPending}>
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};