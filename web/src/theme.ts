import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A237E',
      secondary: '#37474F',
    },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    body1: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(230,235,240,0.7)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            margin: 0,
            width: '100%',
            padding: 0,
          },
        },
        item: {
          '@media (max-width: 600px)': {
            paddingLeft: 0,
            paddingTop: 0,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme; 