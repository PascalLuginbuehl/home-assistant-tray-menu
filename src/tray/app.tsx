import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Configuration from './configuration';

function Fallback(props: FallbackProps) {
  const { resetErrorBoundary } = props;
  return (
    <div>
      There was an error!
      <button onClick={() => resetErrorBoundary()} type="button">Try again</button>
    </div>
  );
}

export default function App() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="window-base">
      <div className="titlebar">
        <h2 className="title">Hello from React!</h2>
      </div>

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
