const fontFamily = '"Segoe UI Variable Text", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif';

export const typography = {
  components: {
      // Ugly fix
      MuiTypography: {
          defaultProps: {
              fontFamily,
          },
      },
  },
  typography: {
    fontFamily,
  },
};
