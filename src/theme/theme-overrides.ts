import { createTheme, Theme } from '@mui/material';

const applyThemeChanges = (theme: Theme): Theme => createTheme(theme, {
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
    MuiButton: {
      defaultProps: {
        // variant: 'outlined',
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // avoid uppercase
        },
        contained: {
          boxShadow: 'none',
          '&:hover,:active': {
            boxShadow: 'none',
          },
        },
        // make border thicker
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
          // make padding symmetric (because of border change)
          paddingTop: 4,
          paddingBottom: 4,
        },
        outlinedSecondary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,

          // backgroundColor: alpha(filledInputdefaultColor, 0.08),
          // '&.Mui-error': {
          //   backgroundColor: alpha(theme.palette.error.main, 0.2),
          // },

          // '&:hover': {
          //   backgroundColor: alpha(filledInputdefaultColor, 0.12),
          //   // Reset on touch devices, it doesn't add specificity
          //   '@media (hover: none)': {
          //     backgroundColor: alpha(filledInputdefaultColor, 0.12),
          //   },
          // },

          // '&.Mui-disabled:hover': {
          //   backgroundColor: 'rgba(0, 0, 0, .12)',
          // },

          // '&.Mui-focused': {
          //   backgroundColor: alpha(filledInputdefaultColor, 0.2),
          // },
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export default applyThemeChanges;
