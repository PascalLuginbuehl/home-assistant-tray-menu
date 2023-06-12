
//
//
//    Tray
//
//

function createTray() {
  if (tray != null) return false;

  const { Tray } = require('electron')
  tray = new Tray(getTrayIconPath())
  tray.setToolTip('Twinkle Tray' + (isDev ? " (Dev)" : ""))
  setTrayMenu()
  tray.on("click", async () => toggleTray(true))

  let lastMouseMove = Date.now()
  tray.on('mouse-move', async () => {
    const now = Date.now()
    if(lastMouseMove + 500 > now) return false;
    lastMouseMove = now
    bounds = tray.getBounds()
    bounds = screen.dipToScreenRect(null, bounds)
    tryEagerUpdate(false)
    sendToAllWindows('panel-unsleep')

    if(settings.scrollShortcut) {
      // Start tracking cursor to determine when it leaves the tray
      if(mouseEvents && mouseEvents.getPaused()) {
        pauseMouseEvents(false)
      }
      willPauseMouseEvents()
    }
  })

}

function setTrayMenu() {
  if (tray === null) return false;

  const contextMenu = Menu.buildFromTemplate([
    getTimeAdjustmentsMenuItem(),
    getDetectIdleMenuItem(),
    getPausableSeparatorMenuItem(),
    { label: T.t("GENERIC_REFRESH_DISPLAYS"), type: 'normal', click: () => refreshMonitors(true, true) },
    { label: T.t("GENERIC_SETTINGS"), type: 'normal', click: createSettings },
    { type: 'separator' },
    getDebugTrayMenuItems(),
    { label: T.t("GENERIC_QUIT"), type: 'normal', click: quitApp }
  ])
  tray.setContextMenu(contextMenu)
}

function getPausableSeparatorMenuItem() {
  if(settings.detectIdleTimeEnabled || settings.adjustmentTimes.length > 0) {
    return { type: 'separator' }
  }
  return { label: "", visible: false }
}

function getTimeAdjustmentsMenuItem() {
  if(settings.adjustmentTimes?.length) {
    return { label: T.t("GENERIC_PAUSE_TOD"), type: 'checkbox', click: (e) => tempSettings.pauseTimeAdjustments = e.checked }
  }
  return { label: "", visible: false }
}

function getDetectIdleMenuItem() {
  if(settings.detectIdleTimeEnabled) {
    return { label: T.t("GENERIC_PAUSE_IDLE"), type: 'checkbox', click: (e) => tempSettings.pauseIdleDetection = e.checked }
  }
  return { label: "", visible: false }
}

function getDebugTrayMenuItems() {
  return { label: "DEBUG", visible: (settings.isDev ? true : false), submenu: [
    { label: "RESTART PANEL", type: 'normal', click: () => restartPanel() },
    { label: "MINIMIZE PANEL", type: 'normal', click: () => mainWindow?.minimize() },
    { label: "HIDE PANEL", type: 'normal', click: () => showPanel(false) },
    { label: "OPACITY 0", type: 'normal', click: () => mainWindow?.setOpacity(0) },
    { label: "OPACITY 1", type: 'normal', click: () => mainWindow?.setOpacity(1) },
    { label: "DO CURRENT TOD", type: 'normal', click: () => applyCurrentAdjustmentEvent(true) },
    { label: "REMOVE ACRYLIC", type: 'normal', click: () => tryVibrancy(mainWindow, false) },
    { label: "PAUSE MOUSE", type: 'normal', click: () => pauseMouseEvents(true) },
    { label: "LAST ACTIVE WIN", type: 'normal', click: () => trySetForegroundWindow(lastActiveWindow) }
  ] }
}

function setTrayPercent() {
  try {
    if (tray) {
      let averagePerc = 0
      let i = 0
      for (const key in monitors) {
        if (monitors[key].type === "ddcci" || monitors[key].type === "wmi") {
          i++
          averagePerc += monitors[key].brightness
        }
      }
      if (i > 0) {
        averagePerc = Math.floor(averagePerc / i)
        tray.setToolTip('Twinkle Tray' + (isDev ? " (Dev)" : "") + ' (' + averagePerc + '%)')
      }
    }
  } catch (e) {
    console.log(e)
  }
}

let lastEagerUpdate = 0
function tryEagerUpdate(forceRefresh = true) {
  const now = Date.now()
  if (now > lastEagerUpdate + 5000) {
    lastEagerUpdate = now
    refreshMonitors(forceRefresh, true)
  }
}

function quitApp() {
  app.quit()
}

const toggleTray = async (doRefresh = true, isOverlay = false) => {

  if (mainWindow == null) {
    createPanel(true)
    return false
  }

  if (isRefreshing) {
    //shouldShowPanel = true
    //return false
  }

  if (doRefresh && !isOverlay) {
    tryEagerUpdate(false)
    getThemeRegistry()
    getSettings()

    // Send accent
    sendToAllWindows('update-colors', getAccentColors())
    if (latestVersion) sendToAllWindows('latest-version', latestVersion);
  }

  if (mainWindow) {
    mainWindow.setBackgroundColor("#00000000")
    if (!isOverlay) {

      // Check if overlay is currently open and deal with that
      if (!canReposition) {
        showPanel(false)
        hotkeyOverlayHide()
        setTimeout(() => {
          sendToAllWindows("display-mode", "normal")
          //toggleTray(doRefresh, isOverlay)
        }, 300)
        return false
      }
      sendMicaWallpaper()
      sendToAllWindows("display-mode", "normal")
      showPanel(true, panelSize.height)
      panelState = "visible"
      mainWindow.focus()
    } else {
      sendToAllWindows("display-mode", "overlay")
      panelState = "overlay"
    }
    sendToAllWindows('request-height')
    mainWindow.webContents.send("tray-clicked")
    mainWindow.setSkipTaskbar(false)
    mainWindow.setSkipTaskbar(true)
  }
}


