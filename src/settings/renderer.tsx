import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './app';
import darkTheme from '../theme/dark-theme';
import '../i18next';

// this element does 100% exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = window.document.getElementById('app')!;

const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient();

// const theme = useMediaQuery("(prefers-color-scheme: dark)") ? darkTheme : lightTheme;

root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </QueryClientProvider>,
);
