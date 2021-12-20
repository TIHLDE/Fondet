import { createTheme } from '@mui/material/styles';

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1c458a',
      light: '#5470bb',
      dark: '#001f5c',
      contrastText: '#fff',
    },
    info: {
      main: '#fff',
    },
    background: { default: '#001328', paper: '#0d2339' },
    text: {
      primary: '#fff',
    },
  },
  typography: {
    fontFamily: [
      '"Roboto"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      marginTop: '3rem',
      fontWeight: 'bold',
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'normal',
      marginBottom: '1rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
    },
    MuiButton: {
      styleOverrides: { root: { fontWeight: 300 } },
    },
    MuiLink: {
      styleOverrides: { root: { color: '#7faeff' } },
    },
    MuiAccordionSummary: {
      styleOverrides: { content: { '&.Mui-expanded': { marginBottom: 10 } } },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 700,
      lg: 1000,
      xl: 1300,
    },
  },
});

export default dark;
