import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

import "./css/vars.scss"
import "./css/panel.scss"

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
})

root.render(
  <QueryClientProvider client={queryClient}>
    <div id="root">
      <App />
    </div>
  </QueryClientProvider>
);

window.electronAPI.registerHeightRequestCallback(() => {
  window.electronAPI.sendHeight(container.offsetHeight)
})
