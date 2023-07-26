import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import '../i18next';
import App from './app';
import { SettingsProvider } from '../utils/use-settings';
import darkTheme from '../theme/dark-theme';
import lightTheme from '../theme/light-theme';

// this element does 100% exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = window.document.getElementById('app')!;

const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient();

function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useMediaQuery('(prefers-color-scheme: dark)') ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

root.render(
  <QueryClientProvider client={queryClient}>
    <MuiThemeProvider>
      <CssBaseline enableColorScheme />
      <HashRouter>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </HashRouter>
    </MuiThemeProvider>
  </QueryClientProvider>,
);
