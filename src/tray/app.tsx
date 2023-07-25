import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Configuration from './configuration';
import './app.css';

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
  // const os = useOsTheme();

  const { data: settings, isSuccess } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => window.electronAPI.store.getSettings(),
    suspense: true,
  });

  const { data: systemAttributes } = useQuery({
    queryKey: ['system-attributes'],
    queryFn: async () => window.electronAPI.getSystemAttributes(),
    suspense: true,
  });

  useEffect(() => {
    if (settings && systemAttributes) {
      const { accentColor, osTheme } = systemAttributes;

      window.document.body.dataset.osTheme = settings.development.osTheme === 'system' ? osTheme : settings.development.osTheme;

      const rgba = hexToRgb(accentColor);
      window.document.body.style.setProperty('--accent-main', `${rgba?.r} ${rgba?.g} ${rgba?.b}`);
    }
  }, [settings, systemAttributes]);

  if (!isSuccess) {
    return null;
  }

  return (
    <div className={
      clsx(
        'bg-background-tray',
        // win10 ? 'shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]'
        //   : 'shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]',
      )
    }
    >
      <Configuration entities={settings?.entities} />
    </div>
  );
}
