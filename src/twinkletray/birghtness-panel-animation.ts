
/*


    Brightness panel animations


*/



let panelAnimationInterval = false
let shouldAnimatePanel = false
let isAnimatingPanel = false
let panelHeight = 0
const panelMaxHeight = 80
const panelTransitionTime = 0.35
let currentPanelTime = 0
let startPanelTime = process.hrtime.bigint()
let lastPanelTime = process.hrtime.bigint()
let primaryRefreshRate = 59.97
let primaryDPI = 1
let mainWindowHandle
const easeOutQuad = t => 1 + (--t) * t * t * t * t

// Set brightness panel state (visible or not)
function showPanel(show = true, height = 300) {

  if (show) {
    // Show panel
    if(startHideTimeout) clearTimeout(startHideTimeout); // Reset "hide" timeout
    startHideTimeout = null
    mainWindow.restore()
    mainWindowHandle = mainWindow.getNativeWindowHandle().readInt32LE(0)
    repositionPanel()
    panelHeight = height
    panelSize.visible = true

    panelSize.bounds = screen.dipToScreenRect(mainWindow, mainWindow.getBounds())
    panelSize.bounds = mainWindow.getBounds()
    primaryDPI = screen.getPrimaryDisplay().scaleFactor
    panelHeight = panelHeight * primaryDPI

    if (settings.useNativeAnimation && settings.useAcrylic && lastTheme.EnableTransparency) {
      // Acrylic + Native Animation
      if (lastTheme && lastTheme.ColorPrevalence) {
        tryVibrancy(mainWindow, { theme: getAccentColors().dark + (settings.useAcrylic ? "D0" : "70"), effect: (settings.useAcrylic ? "acrylic" : "blur") })
      } else {
        tryVibrancy(mainWindow, { theme: (lastTheme && lastTheme.SystemUsesLightTheme ? (settings.useAcrylic ? "#DBDBDBDD" : "#DBDBDB70") : (settings.useAcrylic ? "#292929DD" : "#29292970")), effect: (settings.useAcrylic ? "acrylic" : "blur") })
      }
      startPanelAnimation()
    } else {
      // No blur, or CSS Animation
      tryVibrancy(mainWindow, false)
      mainWindow.setBackgroundColor("#00000000")
      if (panelSize.taskbar.position === "TOP") {
        // Top
        setWindowPos(mainWindowHandle, -2, panelSize.bounds.x * primaryDPI, ((panelSize.base) * primaryDPI), panelSize.bounds.width * primaryDPI, panelHeight, 0x0400)
      } else {
        // Bottom, left, right
        mainWindow.show()
        mainWindow.setBounds(panelSize.bounds)
      }
    }

    setAlwaysOnTop(true)
    mainWindow.focus()

    // Resume mouse events if disabled
    pauseMouseEvents(false)
    mainWindow.setOpacity(1)
    mainWindow.show()
    sendToAllWindows('panel-position', mainWindow.getPosition())
    sendToAllWindows("playPanelAnimation")

  } else {
    // Hide panel
    setAlwaysOnTop(false)
    panelSize.visible = false
    clearInterval(panelAnimationInterval)
    panelAnimationInterval = false
    shouldAnimatePanel = false
    isAnimatingPanel = false
    sendToAllWindows("display-mode", "normal")
    panelState = "hidden"
    sendToAllWindows("closePanelAnimation")
    if (!settings.useAcrylic || !settings.useNativeAnimation) {
      tryVibrancy(mainWindow, false)
    }
    // Pause mouse events
    pauseMouseEvents(true)
    startHidePanel()
  }
}

function trySetForegroundWindow(hwnd) {
  try {
    console.log("trySetForegroundWindow: " + hwnd)
    WindowUtils.setForegroundWindow(hwnd)
  } catch(e) {
    console.log("Couldn't focus window after minimize!", e)
  }
}

let startHideTimeout
let lastActiveWindow = 0
function startHidePanel() {
  const mainWindowHWND = mainWindow.getNativeWindowHandle().readInt32LE()
  if(!startHideTimeout) {
    startHideTimeout = setTimeout(() => {
      lastActiveWindow = 0
      if(mainWindow) {
        try {
          lastActiveWindow = WindowUtils.getForegroundWindow()
          console.log("getForegroundWindow: " + lastActiveWindow)
        } catch(e) {
          console.log("Couldn't get foreground window!", e)
        }
        mainWindow.minimize();
      }
      startHideTimeout = null
      setTimeout(() => {
        try { global.gc() } catch(e) {}
      }, 1000)

      // Kill me
      if(lastActiveWindow && lastActiveWindow != mainWindowHWND) {
        trySetForegroundWindow(lastActiveWindow);
        setTimeout(() => {
          trySetForegroundWindow(lastActiveWindow);
        }, 33)
        setTimeout(() => {
          trySetForegroundWindow(lastActiveWindow);
        }, 50)
        setTimeout(() => {
          trySetForegroundWindow(lastActiveWindow);
        }, 100)
      }

    }, 100)

    if(mainWindow) mainWindow.setOpacity(0);
  }
}

// Begins panel opening animation
async function startPanelAnimation() {
  if (!shouldAnimatePanel) {

    // Set to animating
    shouldAnimatePanel = true
    isAnimatingPanel = true

    // Reset timing variables
    startPanelTime = process.hrtime.bigint()
    currentPanelTime = -1

    // Get refresh rate of primary display
    // This allows the animation to play no more than the refresh rate
    primaryRefreshRate = await refreshCtx.findVerticalRefreshRateForDisplayPoint(0, 0)

    // Start animation interval after a short delay
    // This avoids jank from React updating the DOM
    if (!panelAnimationInterval)
      setTimeout(() => {
        if (!panelAnimationInterval)
          panelAnimationInterval = setTimeout(doAnimationStep, 1000 / 600)
      }, 100)
  }
}

// Borrowed some of this animation logic from @djsweet
function hrtimeDeltaForFrequency(freq) {
  return BigInt(Math.ceil(1000000000 / freq));
}
let busy = false
function doAnimationStep() {

  // If animation has been requested to stop, kill it
  if (!isAnimatingPanel) {
    clearInterval(panelAnimationInterval)
    panelAnimationInterval = false
    shouldAnimatePanel = false
    return false
  }

  if (currentPanelTime === -1) {
    startPanelTime = process.hrtime.bigint()
    currentPanelTime = 0
  }
  // Limit updates to specific interval

  const now = process.hrtime.bigint()
  if (!busy && now > lastPanelTime + hrtimeDeltaForFrequency(primaryRefreshRate * (settings.useAcrylic ? 1 : 2) || 59.97)) {

    lastPanelTime = now
    currentPanelTime = Number(Number(now - startPanelTime) / 1000000000)

    // Check if at end of animation
    if (currentPanelTime >= panelTransitionTime) {
      // Stop animation
      isAnimatingPanel = false
      shouldAnimatePanel = false
      // Stop at 100%
      currentPanelTime = panelTransitionTime
      clearInterval(panelAnimationInterval)
      panelAnimationInterval = false
    }

    // LERP height and opacity
    const calculatedHeight = panelHeight - (panelMaxHeight * primaryDPI) + Math.round(easeOutQuad(currentPanelTime / panelTransitionTime) * (panelMaxHeight * primaryDPI))
    const calculatedOpacity = (Math.round(Math.min(1, currentPanelTime / (panelTransitionTime / 6)) * 100) / 100)

    // Apply panel size

    busy = true
    if (panelSize.taskbar.position === "TOP") {
      // Top
      setWindowPos(mainWindowHandle, -2, panelSize.bounds.x * primaryDPI, ((panelSize.base) * primaryDPI), panelSize.bounds.width * primaryDPI, calculatedHeight, 0x0400)
    } else {
      // Bottom, left, right
      setWindowPos(mainWindowHandle, -2, panelSize.bounds.x * primaryDPI, ((panelSize.base) * primaryDPI) + (panelHeight - calculatedHeight), panelSize.bounds.width * primaryDPI, calculatedHeight + (6 * primaryDPI * (settings.useAcrylic ? 0 : 1)), 0x0400)
    }

    // Stop opacity updates if at 1 already
    if (mainWindow.getOpacity() < 1)
      mainWindow.setOpacity(calculatedOpacity)
    busy = false
  }

  if (isAnimatingPanel) {
    panelAnimationInterval = setTimeout(doAnimationStep, 1000 / (primaryRefreshRate * (settings.useAcrylic ? 1 : 2) || 59.97))
  } else {
    repositionPanel()
  }
}







