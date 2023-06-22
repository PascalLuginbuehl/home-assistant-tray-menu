import { ipcMain } from 'electron';
import { createTray } from './tray-utils';
import PanelController from './panel-controller';

const initTray = (app: Electron.App): void => {
  const panel = PanelController.createInstance();
  // trigger reload to load new API Keys and API Url
  ipcMain.on('electron-store-set', async () => {
    panel.reload();
  });

  const tray = createTray(app, panel);
  // showPanel(panel, true, 100)
};

export default initTray;
