import {
  ipcMain, Menu, Tray,
} from 'electron';
import path from 'path';
import PanelController from './panel-controller';
import openSettings from './settings';
import redIconImagePath from '../../assets/redIcon@3x.png';

export function getTrayIconPath() {
  return path.resolve(__dirname, redIconImagePath);
}

const T = {
  t: (key: string) => key,
};

export function setTrayMenu(tray: Tray, app: Electron.App) {
  if (tray === null) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: T.t('GENERIC_SETTINGS'), type: 'normal', click: () => openSettings() },
    { type: 'separator' },
    { label: T.t('GENERIC_QUIT'), type: 'normal', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
}

const initTray = (app: Electron.App): void => {
  const panelWindow = PanelController.createInstance();
  // trigger reload to load new API Keys and API Url
  ipcMain.on('electron-store-set', async () => {
    panelWindow.reload();
  });

  const tray = new Tray(getTrayIconPath());
  tray.setToolTip('Twinkle Tray');
  setTrayMenu(tray, app);

  tray.on('click', async () => {
    PanelController.showPanel();
    panelWindow.webContents.send('request-height');
    panelWindow.focus();
  });
};

export default initTray;
