import { createTheme } from '@mui/material/styles';

// Colores base inspirados en el diseño que proporcionaste
const rawColors = {
  // Colores principales
  primary: {
    main: '#007bff', // Azul vibrante para elementos principales (podrías ajustarlo para que sea más morado/violeta)
    light: '#65a9ff',
    dark: '#004c99',
    contrastText: '#fff',
  },
  secondary: {
    main: '#6c757d', // Gris para elementos secundarios
    light: '#a2a7ad',
    dark: '#414950',
    contrastText: '#fff',
  },
  // Colores de fondo para el tema oscuro
  background: {
    default: '#1a1a2e', // Fondo principal oscuro (azul marino oscuro)
    paper: '#232946', // Fondo de componentes como Cards, Paper (azul más claro, violeta oscuro)
    menu: '#161625', // Fondo del menú lateral (aún más oscuro si lo deseas)
  },
  // Colores de texto
  text: {
    primary: '#e0e0e0', // Texto claro en fondos oscuros
    secondary: '#b0b0b0', // Texto secundario
    disabled: '#808080',
  },
  // Otros colores
  info: {
    main: '#00bcd4',
  },
  success: {
    main: '#4caf50',
  },
  warning: {
    main: '#ff9800',
  },
  error: {
    main: '#f44336',
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark', // Establece el modo oscuro
    ...rawColors, // Añade nuestros colores personalizados

    // Sobrescribir colores de superficie para dar ese aspecto degradado
    // Los colores en el dashboard parecen tener un gradiente o un color de fondo ligeramente diferente
    // Puedes ajustar estos valores para que coincidan mejor con los tonos morados/azules del ejemplo
    surface: {
      default: '#232946', // Para Paper, Card (similar a background.paper)
      gradient1: 'linear-gradient(135deg, #3f007e, #5a189a)', // Ejemplo para algún elemento específico
      gradient2: 'linear-gradient(135deg, #1f4287, #212738)', // Ejemplo para otro elemento
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','), // Usa una fuente moderna
    h1: { fontSize: '3rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    h3: { fontSize: '2rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: rawColors.background.menu, // AppBar más oscuro para contrastar
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: rawColors.background.menu, // Fondo del menú lateral
          color: rawColors.text.primary,
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiPaper: { // Estilos para el componente Paper (usado en Cards, etc.)
      styleOverrides: {
        root: {
          backgroundColor: rawColors.background.paper, // Fondo de las tarjetas y paneles
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Sin mayúsculas automáticas
          borderRadius: 8,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(45deg, #5a189a 30%, #3f007e 90%)', // Degradado para botones primarios
          boxShadow: '0 3px 5px 2px rgba(90, 24, 154, .3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiLink: { // Estilo para los links
      styleOverrides: {
        root: {
          color: rawColors.primary.light,
          '&:hover': {
            color: rawColors.primary.main,
          },
        },
      },
    },
    MuiInputBase: { // Estilo para inputs de texto
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#343a5e', // Un color de fondo para inputs
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${rawColors.primary.light}`,
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(90, 24, 154, 0.2)', // Fondo para elemento seleccionado
            color: rawColors.primary.light,
            '& .MuiListItemIcon-root': {
              color: rawColors.primary.light,
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(90, 24, 154, 0.1)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: rawColors.text.secondary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
});

export default theme;