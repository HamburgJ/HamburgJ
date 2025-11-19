import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000080', // Classic Navy Blue
      light: '#42A5F5',
      dark: '#000050',
    },
    secondary: {
      main: '#808080', // Classic Grey
    },
    background: {
      default: '#F0F0E0', // Beige/Off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#404040',
    },
    divider: '#808080',
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Courier New", monospace',
    h1: { fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontWeight: 700, letterSpacing: '-0.5px' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: {
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      fontSize: '0.9rem',
    },
    body2: {
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      fontSize: '0.85rem',
    },
    button: {
      fontFamily: '"JetBrains Mono", "Courier New", monospace',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F0F0E0',
          backgroundImage: 'radial-gradient(#808080 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid transparent',
          '&:hover': {
            border: '2px solid #000000',
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        },
        contained: {
          boxShadow: 'none',
          border: '2px solid #000000',
          '&:hover': {
            boxShadow: '2px 2px 0px rgba(0,0,0,1)',
            transform: 'translate(-1px, -1px)',
          },
        },
        outlined: {
          border: '2px solid #000000',
          '&:hover': {
            border: '2px solid #000000',
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
