import {
  ipcMain, Menu, Tray,
} from 'electron';
import path from 'path';
import i18next from '../i18next';
import PanelController from './panel-controller';
import openSettings from './settings';
import defaultIconImagePath from '../../assets/icon@3x.png';
import transparentIconImagePath from '../../assets/transparentIcon@3x.png';
import warningIconImagePath from '../../assets/alert@2x.png';
import errorIconImagePath from '../../assets/redIcon@3x.png';
import APIUrlStateEnum from '../types/api-state-enum';

const ICON_PATHS = {
  DEFAULT: path.resolve(__dirname, defaultIconImagePath),
  TRANSPARENT: path.resolve(__dirname, transparentIconImagePath),
  WARNING_ICON: path.resolve(__dirname, warningIconImagePath),
  ERROR: path.resolve(__dirname, errorIconImagePath),
};

let tray: Tray | null = null;

export function setTrayMenu(app: Electron.App) {
  if (tray === null) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: i18next.t('SETTINGS'), type: 'normal', click: () => openSettings() },
    { type: 'separator' },
    { label: i18next.t('QUIT'), type: 'normal', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
}

const createTray = (app: Electron.App): void => {
  const panelController = new PanelController();

  // trigger reload to load new API Keys and API Url
  ipcMain.on('reload-api', () => {
    panelController.panelWindow.reload();
  });

  tray = new Tray(ICON_PATHS.DEFAULT);
  tray.setToolTip('Home Assistant Controlls');
  setTrayMenu(app);

  tray.on('click', async () => {
    panelController.showPanel();
    panelController.panelWindow.webContents.send('request-height');
    panelController.panelWindow.focus();
  });
};

export const setIconStatus = (status: APIUrlStateEnum) => {
  if (!tray) {
    return;
  }

  if (status === APIUrlStateEnum.ok) {
    tray.setImage(ICON_PATHS.DEFAULT);
  } else {
    tray.setImage(ICON_PATHS.ERROR);
  }
};

export default createTray;
