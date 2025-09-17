import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Toolbar, Typography, Button, IconButton 
} from '@mui/material';
import { 
  PointOfSale, Inventory, Assessment, People, Logout, Dashboard as DashboardIcon, 
  Settings, SupervisedUserCircle, History, PointOfSale as CashierIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const ListItemLink = (props) => {
  const { icon, primary, to } = props;
  return (
    <li>
      <ListItemButton component={RouterLink} to={to} sx={{ my: 0.5 }}>
        {icon ? <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }} />
      </ListItemButton>
    </li>
  );
};

export default function POSLayout() {
  const { user, logout } = useAuth();

  const drawer = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: 'background.menu', py: 2,
    }}>
      <Toolbar sx={{ justifyContent: 'center', mb: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.light' }}>
          BERRY POS
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        <ListItemLink to="/pos" primary="Dashboard" icon={<DashboardIcon />} />
        <ListItemLink to="/pos/sales" primary="Ventas" icon={<PointOfSale />} />
        <ListItemLink to="/pos/clients" primary="Clientes" icon={<SupervisedUserCircle />} />

        {user?.role === 'ROLE_ADMIN' && (
          <>
            <ListItemLink to="/pos/cashier-closeout" primary="Corte de Caja" icon={<CashierIcon />} />
            <ListItemLink to="/pos/sales-history" primary="Historial" icon={<History />} />
            <ListItemLink to="/pos/inventory" primary="Inventario" icon={<Inventory />} />
            <ListItemLink to="/pos/reports" primary="Reportes" icon={<Assessment />} />
            <ListItemLink to="/pos/users" primary="Usuarios" icon={<People />} />
          </>
        )}
      </List>
      <Box sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" fullWidth onClick={logout} startIcon={<Logout />}>
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,
          bgcolor: 'background.paper', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">Punto de Venta</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit"><Settings /></IconButton>
            <IconButton color="inherit"><People /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth, flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        variant="permanent" anchor="left"
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, bgcolor: 'background.default', p: 3,
          minHeight: '100vh', overflow: 'auto',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}