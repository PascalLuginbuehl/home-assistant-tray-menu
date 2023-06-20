

import { BrowserWindow, screen } from "electron";
import mouseEvents from "global-mouse-events"
import PanelController from "./panel-controller"

export function enableMouseEvents(window: BrowserWindow) {
    try {

      // Handle edge cases where "blur" event doesn't properly fire
      mouseEvents.on("mousedown", (e) => {
        // if (panelSize.visible) {

          // Check if clicking outside of panel/overlay
          const pBounds = screen.dipToScreenRect(window, window.getBounds())
          console.log(pBounds)
          if (e.x < pBounds.x || e.x > pBounds.x + pBounds.width || e.y < pBounds.y || e.y > pBounds.y + pBounds.height) {
            console.log("clicked")
            // Panel is displayed
            // if(!window.webContents.isDevToolsOpened()) {
              PanelController.showPanel(false)
            // }
          }

        // }
      })

    } catch (e) {
      console.error(e)
    }
  }

export function pauseMouseEvents() {
  if(mouseEvents && !mouseEvents.getPaused()) {
    console.log("Pausing mouse events...")
    mouseEvents.pauseMouseEvents()
  }
}

export function resumeMouseEvents() {
  if(mouseEvents && mouseEvents.getPaused()) {
    console.log("Resuming mouse events...")
    mouseEvents.resumeMouseEvents()
  }
}
