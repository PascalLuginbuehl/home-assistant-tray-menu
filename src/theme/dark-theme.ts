import { createTheme } from '@mui/material/styles';
import applyThemeOverrides from './theme-overrides';
import typography from './typography';

const darkThemePalette = createTheme({
  ...typography,
  palette: {
    mode: 'dark',
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: 'white',
    },
    secondary: {
      main: '#f50057',
    },
    divider: 'rgb(37, 37, 45)',
    background: {
      default: 'rgb(19, 19, 24)',
      paper: 'rgb(9, 9, 13)',
    },
  },
});

const darkTheme = applyThemeOverrides(darkThemePalette);

export default darkTheme;
