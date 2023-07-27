import React, { useEffect } from 'react';
import clsx from 'clsx';
import invert from 'invert-color';
import Configuration from './configuration';
import './app.css';
import { useSettings } from '../utils/use-settings';
import CheckForUpdates from './check-for-update';

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
  const { settings, systemAttributes } = useSettings();

  useEffect(() => {
    window.document.body.dataset.osTheme = systemAttributes.computedOsTheme;
    const rgba = hexToRgb(systemAttributes.accentColor);
    if (!rgba) return;

    window.document.body.style.setProperty('--accent-main', `${rgba.r} ${rgba.g} ${rgba.b}`);
    window.document.body.style.setProperty('--accent-main-contrast-text', invert(rgba, true));
  }, [systemAttributes]);

  return (
    <div className={
      clsx(
        'bg-background-tray',
        'flex flex-col',
        {
          'shadow-[0.5px_0.5px_0_0.5px_var(--tray-border)_inset]': systemAttributes.computedOsTheme === 'win10',
          'rounded-[8px] shadow-[0_0_0_1px_#41414144_inset] m-[12px] p-3 gap-2': systemAttributes.computedOsTheme === 'win11',
        },
      )
    }
    >
      <CheckForUpdates />
      <Configuration entities={settings.entities} />
    </div>
  );
}
