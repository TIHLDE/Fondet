import { createTheme } from '@mui/material/styles';

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1c458a',
      light: '#5470bb',
      dark: '#0d2339',
      contrastText: '#fff',
    },
    info: {
      main: '#fff',
    },
    background: { default: '#001328', paper: '#011830' },
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
      fontSize: '1.7rem',
      marginTop: '2rem',
      fontWeight: 'normal',
      marginBottom: '1rem',
      '@media (min-width:500px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
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
      styleOverrides: { root: { color: '#9ec0ff' } },
    },
    MuiAccordionSummary: {
      styleOverrides: { content: { '&.Mui-expanded': { marginBottom: 5 } } },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 730,
      lg: 900,
      xl: 1200,
    },
  },
});

export default dark;
