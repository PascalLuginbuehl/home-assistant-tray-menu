import {
  app,
  ipcMain, Menu, nativeTheme, shell, Tray,
} from 'electron';
import path from 'path';
import i18next from '../i18next';
import { createPanel, showPanel } from './panel-controller';
import openSettings from './settings';
import defaultIconImagePath from '../../assets/icon@3x.png';
import defaultIconDarkImagePath from '../../assets/iconDark@3x.png';
import errorIconImagePath from '../../assets/redIcon@3x.png';
import APIUrlStateEnum from '../types/api-state-enum';

const ICON_PATHS = {
  DEFAULT: path.resolve(__dirname, defaultIconImagePath),
  DEFAULT_DARK: path.resolve(__dirname, defaultIconDarkImagePath),
  ERROR: path.resolve(__dirname, errorIconImagePath),
};

let tray: Tray | null = null;

export function createTray() {
  const panelWindow = createPanel();

  // trigger reload to load new API Keys and API Url
  ipcMain.on('reload-api', () => {
    panelWindow.reload();
  });

  tray = new Tray(nativeTheme.shouldUseDarkColors ? ICON_PATHS.DEFAULT : ICON_PATHS.DEFAULT_DARK);

  tray.setToolTip('Home Assistant Controlls');

  const contextMenu = Menu.buildFromTemplate([
    { label: i18next.t('SETTINGS'), type: 'normal', click: () => openSettings() },
    { type: 'separator' },
    { label: i18next.t('QUIT'), type: 'normal', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  tray.on('click', async () => {
    showPanel();
    panelWindow.webContents.send('request-height');
    panelWindow.focus();
  });

  panelWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  return panelWindow;
}

export function setIconStatus(status: APIUrlStateEnum) {
  if (!tray) {
    return;
  }

  if (status === APIUrlStateEnum.ok) {
    tray.setImage(nativeTheme.shouldUseDarkColors ? ICON_PATHS.DEFAULT : ICON_PATHS.DEFAULT_DARK);
  } else {
    tray.setImage(ICON_PATHS.ERROR);
  }
}
