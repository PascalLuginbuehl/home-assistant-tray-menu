import React, { Suspense, useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import clsx from 'clsx';
import Configuration from './configuration';
import './app.css';

function Fallback(props: FallbackProps) {
  const { resetErrorBoundary } = props;
  return (
    <div style={{ height: 200, padding: 24 }}>
      There was an error!
      <br />
      Please check your API connection by right-clicking on the tray icon and opening settings.
      <br />
      <button onClick={() => resetErrorBoundary()} type="button" className="bg-accent-main p-2 font-medium">Retry</button>
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

  // const os = useOsTheme();

  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className={
      clsx(
        'bg-background-tray',
        // win10 ? 'shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]'
        //   : 'shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]',
      )
    }
    >
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
