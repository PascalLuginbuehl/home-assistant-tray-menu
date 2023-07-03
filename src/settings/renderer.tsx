import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import darkTheme from '../theme/dark-theme';
import '../i18next';
import Navigation from './navigation';
import App from './app';

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
      <HashRouter>
        <Box display="flex">
          <Navigation />
          <App />
        </Box>
      </HashRouter>
    </ThemeProvider>
  </QueryClientProvider>,
);
