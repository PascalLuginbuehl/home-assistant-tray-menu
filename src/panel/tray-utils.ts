import { BrowserWindow, Menu, Tray } from "electron"
import path from "path"
import { showPanel } from "./windowController"

export function getTrayIconPath() {
  return path.join(__dirname, '../..', '/assets/redIcon@3x.png')
}

export function createTray(app: Electron.App, window: BrowserWindow) {
  const tray = new Tray(getTrayIconPath())
  tray.setToolTip('Twinkle Tray')
  setTrayMenu(tray, app)
  tray.on("click", async () => {
    showPanel(window, true)
    window.webContents.send('request-height')
    window.focus()
  })
}

const T = {
  t: (key: string) => key
}

export function setTrayMenu(tray: Tray, app: Electron.App) {
  if (tray === null) return false;

  const contextMenu = Menu.buildFromTemplate([
    // getTimeAdjustmentsMenuItem(),
    // getDetectIdleMenuItem(),
    // getPausableSeparatorMenuItem(),
    { label: T.t("GENERIC_SETTINGS"), type: 'normal', click: () => {} },
    { type: 'separator' },
    { label: T.t("GENERIC_QUIT"), type: 'normal', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
}
