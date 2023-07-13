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
    <div className="window-base">
      {/* <div className="titlebar">
        <h2 className="title">Home Assistant Controls</h2>
      </div> */}

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
