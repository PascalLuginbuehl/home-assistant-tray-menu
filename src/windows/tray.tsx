import { ipcMain } from 'electron';
import { createTray } from './tray-utils';
import PanelController from './panel-controller';

const initTray = (app: Electron.App): void => {
  const panel = PanelController.createInstance();
  // trigger reload to load new API Keys and API Url
  ipcMain.on('electron-store-set', async () => {
    panel.reload();
  });

  createTray(app, panel);
};

export default initTray;
