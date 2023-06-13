import { BrowserWindow, screen } from 'electron'
import { IPanelSize, ITaskbarPosition, TaskbarPositionsEnum } from './windowController';

export function taskbarPosition(): ITaskbarPosition {
  const primaryDisplay = screen.getPrimaryDisplay()

  const bounds = primaryDisplay.bounds
  const workArea = primaryDisplay.workArea
  let gap = 0
  let position: TaskbarPositionsEnum = "BOTTOM"
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

  return { position, gap }
}

export function repositionPanel(window: BrowserWindow, panelSize: IPanelSize) {
  try {
    const primaryDisplay = screen.getPrimaryDisplay()

    const taskbar = taskbarPosition()
    panelSize.taskbar = taskbar

    if (window) {
      if (taskbar.position == "LEFT") {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + taskbar.gap,
          y: primaryDisplay.bounds.y + primaryDisplay.workArea.height - panelSize.height
        })
      } else if (taskbar.position == "TOP") {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + taskbar.gap
        })
      } else {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + primaryDisplay.bounds.height - panelSize.height - taskbar.gap
        })
      }
      panelSize.base = window.getBounds().y
    }
  } catch(e) {
    console.log("Couldn't reposition panel", e)
  }
}
