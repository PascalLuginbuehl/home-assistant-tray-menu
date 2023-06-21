import { BrowserWindow, Menu, Tray } from "electron"
import path from "path"
import PanelController from "./panel-controller"
import { openSettings } from "../"

export function getTrayIconPath() {
  return path.join(__dirname, '../..', '/assets/redIcon@3x.png')
}


export function createTray(app: Electron.App, panelWindow: BrowserWindow) {
  const tray = new Tray(getTrayIconPath())
  tray.setToolTip('Twinkle Tray')
  setTrayMenu(tray, app)

  tray.on("click", async () => {
    PanelController.showPanel()
    panelWindow.webContents.send('request-height')
    panelWindow.focus()
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
    { label: T.t("GENERIC_SETTINGS"), type: 'normal', click: () => openSettings() },
    { type: 'separator' },
    { label: T.t("GENERIC_QUIT"), type: 'normal', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
}
