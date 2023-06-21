import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const container = document.getElementById('app');

const root = createRoot(container); // createRoot(container!) if you use TypeScript

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   suspense: true,
    // },
  },
})

root.render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);
