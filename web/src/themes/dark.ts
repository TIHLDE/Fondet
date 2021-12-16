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
  },
  shape: { borderRadius: 16 },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: 'md' },
    },
  },
});

export default dark;
