import {
  ipcMain, Menu, Tray,
} from 'electron';
import path from 'path';
import axios from 'axios';
import i18next from '../i18next';
import PanelController from './panel-controller';
import openSettings from './settings';
import defaultIconImagePath from '../../assets/icon@3x.png';
import transparentIconImagePath from '../../assets/transparentIcon@3x.png';
import warningIconImagePath from '../../assets/alert@2x.png';
import errorIconImagePath from '../../assets/redIcon@3x.png';
import store from '../store';

const ICON_PATHS = {
  DEFAULT: path.resolve(__dirname, defaultIconImagePath),
  TRANSPARENT: path.resolve(__dirname, transparentIconImagePath),
  WARNING_ICON: path.resolve(__dirname, warningIconImagePath),
  ERROR: path.resolve(__dirname, errorIconImagePath),
};

async function checkApiUrl(apiURL: string, token: string) {
  const { data } = await axios.get(`${apiURL}/api/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export function setTrayMenu(tray: Tray, app: Electron.App) {
  if (tray === null) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: i18next.t('SETTINGS'), type: 'normal', click: () => openSettings() },
    { type: 'separator' },
    { label: i18next.t('QUIT'), type: 'normal', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
}

const initTray = (app: Electron.App): void => {
  const panelController = new PanelController();

  // trigger reload to load new API Keys and API Url
  ipcMain.on('reload', () => {
    panelController.panelWindow.reload();
  });

  const tray = new Tray(ICON_PATHS.DEFAULT);
  tray.setToolTip('Home Assistant Controlls');
  setTrayMenu(tray, app);

  tray.on('click', async () => {
    panelController.showPanel();
    panelController.panelWindow.webContents.send('request-height');
    panelController.panelWindow.focus();
  });

  const checkHassStatus = async () => {
    const settings = store.get('settings');
    try {
      await checkApiUrl(settings.hassApiUrl, settings.longLivedAccessToken);
      tray.setImage(ICON_PATHS.DEFAULT);
    } catch (e) {
      tray.setImage(ICON_PATHS.ERROR);
    }
    setTimeout(checkHassStatus, 5 * 60 * 1000);
  };

  checkHassStatus();
};

export default initTray;
