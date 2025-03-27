import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0d0d',   // Deep dark theater background
      paper: '#1a1a1a',     // Slightly lighter for cards
    },
    primary: {
      main: '#b71c1c',      // Deep velvet red
    },
    secondary: {
      main: '#ffd700',      // Gold
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffd700',
    },
  },
  typography: {
    fontFamily: `'Cinzel', serif`,
    h4: {
      fontWeight: 700,
    },
  },
});

export default theme;
