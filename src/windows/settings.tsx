import { BrowserWindow, screen, shell } from 'electron';

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let settingsWindow: BrowserWindow | null = null;

const openSettings = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  if (settingsWindow && !settingsWindow.isDestroyed) {
    settingsWindow.focus();
    return;
  }

  // Settings from Twinkle tray
  settingsWindow = new BrowserWindow({
    width: (width >= 1200 ? 1024 : 600),
    height: (height >= 768 ? 720 : 500),
    minHeight: 450,
    minWidth: 400,
    // show: false,
    maximizable: true,
    resizable: true,
    minimizable: true,
    autoHideMenuBar: true,
    // backgroundColor: "#00000000",
    // frame: false,
    // icon: './src/assets/logo.ico',
    title: 'Home Assistant Tray Menu Settings',
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  settingsWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
};

export default openSettings;
