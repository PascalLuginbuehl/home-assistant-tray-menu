import React, { Suspense, useEffect } from 'react';
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

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[3], 16),
  } : null;
}

export default function App() {
  useEffect(() => {
    window.electronAPI.getAccentColor().then((color) => {
      const rgba = hexToRgb(color);
      window.document.body.style.setProperty('--accent-main', `${rgba?.r} ${rgba?.g} ${rgba?.b}`);
    });
  }, []);

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
