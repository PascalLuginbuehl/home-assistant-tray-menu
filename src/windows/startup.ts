import { app, nativeTheme } from 'electron';
import { checkAPIStatusPeriodically } from '../hass-api';
import store from '../store';

// defined actions for on startup
export async function setAutoLaunch(state: boolean) {
  // Don't set autoLaunch for dev environment
  if (!app.isPackaged) {
    return;
  }

  const { openAtLogin } = await app.getLoginItemSettings();

  if (openAtLogin === state) {
    return;
  }

  app.setLoginItemSettings({ openAtLogin: state });
}

export function setOsTheme(theme: 'system' | 'light' | 'dark') {
  nativeTheme.themeSource = theme;
}

export function onStartup() {
  const settings = store.get('settings');
  // Set auto-launch state
  setAutoLaunch(settings.isAutoLaunchEnabled);
  setOsTheme(settings.general.theme);

  checkAPIStatusPeriodically();
}
