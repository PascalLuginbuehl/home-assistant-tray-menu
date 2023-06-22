import { createTheme } from '@mui/material/styles';
import { applyThemeChanges as applyThemeOverrides } from './theme-overrides';
import { typography } from './typography';

const lightThemePalette = createTheme({
  ...typography,
  palette: {
    mode: 'light',
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: 'white',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const lightTheme = applyThemeOverrides(lightThemePalette);

export default lightTheme;
