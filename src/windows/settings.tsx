import { BrowserWindow, screen } from 'electron';

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const openSettings = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Settings from Twinkle tray
  const settingsWindow = new BrowserWindow({
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

      // FIX: Disables CORS preflight checks
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  settingsWindow.webContents.openDevTools({ mode: 'detach' });
};

export default openSettings;
