import React, { Suspense } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Configuration from './configuration';
import './app.css';

function Fallback(props: FallbackProps) {
  const { resetErrorBoundary } = props;
  return (
    <div style={{ height: 100, padding: 24 }}>
      There was an error!
      <br />
      <button onClick={() => resetErrorBoundary()} type="button">Retry</button>
    </div>
  );
}

export default function App() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="bg-background-tray shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]">
      <ErrorBoundary
        onReset={reset}
        fallbackRender={Fallback}
      >
        <Suspense
          fallback="Loading"
        >
          <Configuration />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
