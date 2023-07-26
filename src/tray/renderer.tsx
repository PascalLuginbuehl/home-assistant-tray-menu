import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import '../i18next';
import { ErrorBoundary } from 'react-error-boundary';
import { registerSendHeightCallback } from './send-height';
import App from './app';

// this element does 100% exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = window.document.getElementById('app')!;

const root = createRoot(container);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

function Fallback() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div style={{ height: 200, padding: 24 }}>
      There was an error!
      <br />
      Please check your API connection by right-clicking on the tray icon and opening settings.
      <br />
      <button onClick={() => reset()} type="button" className="bg-accent-main p-2 font-medium">Retry</button>
    </div>
  );
}

root.render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary
      fallbackRender={Fallback}
    >
      <Suspense
        fallback="Loading"
      >
        <App />
      </Suspense>
    </ErrorBoundary>
  </QueryClientProvider>,
);

registerSendHeightCallback();
