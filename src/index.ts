import {
  app, BrowserWindow,
} from 'electron';
import { createTray } from './windows/tray';
import './ipc-main-handlers';
import { showPanel } from './windows/panel-controller';
import { onStartup } from './windows/startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let panelWindow: BrowserWindow | null = null;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (panelWindow) {
      showPanel();
      panelWindow.focus();
    }
  });

  app.on('ready', () => {
    panelWindow = createTray();
    onStartup();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
  }
});
