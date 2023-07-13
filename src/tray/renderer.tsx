import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app';
import '../i18next';

// this element does 100% exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = window.document.getElementById('app')!;

const root = createRoot(container); // createRoot(container!) if you use TypeScript

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);

window.electronAPI.registerHeightRequestCallback(() => {
  window.electronAPI.sendHeight(container.offsetHeight);
});

// eslint-disable-next-line import/prefer-default-export
export function sendHeight() {
  window.electronAPI.sendHeight(container.offsetHeight);
}
