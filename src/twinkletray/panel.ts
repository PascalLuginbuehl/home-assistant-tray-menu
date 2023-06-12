
//
//
//    Initialize Panel
//
//

const panelState = "hidden"
let panelReady = false

function createPanel(toggleOnLoad = false) {

  console.log("Creating panel...")

  const { BrowserWindow } = require('electron')
  mainWindow = new BrowserWindow({
    width: panelSize.width,
    height: panelSize.height,
    x: 0,
    y: 0,
    minHeight: 0,
    minWidth: 0,
    backgroundColor: "#00000000",
    frame: false,
    transparent: true,
    show: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    type: "toolbar",
    title: "Twinkle Tray Flyout",
    maximizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'panel-preload.js'),
      devTools: settings.isDev,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      plugins: false,
      backgroundThrottling: (settings.disableThrottling ? false : true),
      spellcheck: false,
      webgl: false,
      enableWebSQL: false,
      v8CacheOptions: "none",
      zoomFactor: 1.0,
      additionalArguments: ["jsVars" + Buffer.from(JSON.stringify({
        appName: app.name,
        appVersion: app.getVersion()
      })).toString('base64')],
      allowRunningInsecureContent: true,
      webSecurity: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000/index.html"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => { console.log("~~~~~ MAIN WINDOW CLOSED ~~~~~~"); mainWindow = null });
  mainWindow.on("minimize", () => { console.log("~~~~~ MAIN WINDOW MINIMIZED ~~~~~~") });
  mainWindow.on("restore", () => { console.log("~~~~~ MAIN WINDOW RESTORED ~~~~~~") });

  mainWindow.once('ready-to-show', () => {
    if(mainWindow) {
      mainWindow.setMenu(windowMenu)

      panelReady = true
      console.log("Panel ready!")
      createTray()

      showPanel(false)

      setTimeout(() => {
        if(!settings.useAcrylic || settings.isWin11) {
          tryVibrancy(mainWindow, false)
          mainWindow.setBackgroundColor("#00000000")
        }
      }, 100)

      if (toggleOnLoad) setTimeout(() => { toggleTray(false) }, 33);
    }
  })

  mainWindow.on("blur", () => {
    // Only run when not in an overlay
    if (canReposition) {
      if(!mainWindow.webContents.isDevToolsOpened()) {
        sendToAllWindows("panelBlur")
        showPanel(false)
      }
    }
  })

  mainWindow.on('move', (e) => {
    try {
      e.preventDefault()
      sendToAllWindows('panel-position', mainWindow.getPosition())
    } catch(e) { }
  })

  mainWindow.on('resize', (e) => {
    try {
      e.preventDefault()
      sendToAllWindows('panel-position', mainWindow.getPosition())
    } catch(e) { }
  })

  mainWindow.webContents.once('dom-ready', () => {
    try {
      sendToAllWindows('monitors-updated', monitors)
      // Do full refreshes shortly after startup in case Windows isn't ready.
      setTimeout(() => {
        refreshMonitors(true).then(() => {
          sendToAllWindows('monitors-updated', monitors)
        })
      }, 8000)

      setTimeout(sendMicaWallpaper, 1000)
      sendToAllWindows('panel-position', mainWindow.getPosition())
    } catch(e) { }
  })

}

function setAlwaysOnTop(onTop = true) {
  if(!mainWindow) return false;
  if(onTop) {
    mainWindow.setAlwaysOnTop(true, 'modal-panel')
  } else {
    mainWindow.setAlwaysOnTop(false)
  }
  return true
}

function restartPanel(show = false) {
  console.log("Function: restartPanel");
  if (mainWindow) {
    mainWindow.setOpacity(1)
    mainWindow.restore()
    mainWindow.show()
    mainWindow.setBounds({x:0,y:0,width:0,height:0})
  }
  setTimeout(() => {
    if (mainWindow) {
      mainWindow.close()
      mainWindow = null
    }
    createPanel(show)
  }, 1)
}

function getPrimaryDisplay() {
  const displays = screen.getAllDisplays()
  let primaryDisplay = displays.find((display) => {
    return display.bounds.x == 0 || display.bounds.y == 0
  })

  if (tray) {
    try {
      const trayBounds = tray.getBounds()
      const foundDisplay = displays.find(d => {
        return (trayBounds.x >= d.bounds.x && trayBounds.x <= d.bounds.x + d.bounds.width && trayBounds.y >= d.bounds.y && trayBounds.y <= d.bounds.y + d.bounds.height)
      })
      if (foundDisplay) primaryDisplay = foundDisplay;
    } catch (e) { }
  }
  return primaryDisplay
}



const detectedTaskbarPos = false
const detectedTaskbarHeight = false
const detectedTaskbarHide = false
const canReposition = true
function repositionPanel() {
  try {

    if (!canReposition) {
      mainWindow.setBounds({
        width: panelSize.width,
        height: panelSize.height
      })
      return false
    }
    const primaryDisplay = getPrimaryDisplay()

    const taskbarPosition = () => {
      const primaryDisplay = getPrimaryDisplay()

      const bounds = primaryDisplay.bounds
      const workArea = primaryDisplay.workArea
      let gap = 0
      let position = "BOTTOM"
      if (bounds.x < workArea.x) {
        position = "LEFT"
        gap = bounds.width - workArea.width
      } else if (bounds.y < workArea.y) {
        position = "TOP"
        gap = bounds.height - workArea.height
      } else if (bounds.width > workArea.width) {
        position = "RIGHT"
        gap = bounds.width - workArea.width
      } else {
        position = "BOTTOM"
        gap = bounds.height - workArea.height
      }

      // Use taskbar position from registry if auto-hide is on
      if (detectedTaskbarHide) {
        position = detectedTaskbarPos
        if (position === "TOP" || position === "BOTTOM") {
          gap = detectedTaskbarHeight
        }
      }

      if(typeof settings.overrideTaskbarPosition === "string") {
        const pos = settings.overrideTaskbarPosition.toUpperCase()
        if(pos === "BOTTOM" || pos === "TOP" || pos === "LEFT" || pos === "RIGHT") {
          position = pos
        }
      }

      if(typeof settings.overrideTaskbarGap === "number") {
        gap = settings.overrideTaskbarGap
        console.log(gap)
      }

      return { position, gap }
    }

    const taskbar = taskbarPosition()
    panelSize.taskbar = taskbar
    sendToAllWindows('taskbar', taskbar)

    if (mainWindow && !isAnimatingPanel) {
      if (taskbar.position == "LEFT") {
        mainWindow.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + taskbar.gap,
          y: primaryDisplay.bounds.y + primaryDisplay.workArea.height - panelSize.height
        })
      } else if (taskbar.position == "TOP") {
        mainWindow.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + taskbar.gap
        })
      } else if (detectedTaskbarHide && taskbar.position == "BOTTOM") {
        // Edge case for auto-hide taskbar
        mainWindow.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + primaryDisplay.workArea.height - panelSize.height - taskbar.gap
        })
      } else {
        mainWindow.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + primaryDisplay.bounds.height - panelSize.height - taskbar.gap
        })
      }
      panelSize.base = mainWindow.getBounds().y
    }

    sendToAllWindows('panel-position', mainWindow.getPosition())
  } catch(e) {
    console.log("Couldn't reposition panel", e)
  }
}
