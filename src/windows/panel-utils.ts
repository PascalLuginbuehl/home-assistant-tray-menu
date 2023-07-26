import { BrowserWindow, screen } from 'electron';
import type { IPanelSize } from './panel-controller';

export type TaskbarPositionsEnum = 'LEFT' | 'TOP' | 'RIGHT' | 'BOTTOM';
export interface ITaskbarPosition {
  position: TaskbarPositionsEnum,
  gap: number
}

export function taskbarPosition(): ITaskbarPosition {
  const primaryDisplay = screen.getPrimaryDisplay();

  const { bounds } = primaryDisplay;
  const { workArea } = primaryDisplay;
  let gap = 0;
  let position: TaskbarPositionsEnum = 'BOTTOM';
  if (bounds.x < workArea.x) {
    position = 'LEFT';
    gap = bounds.width - workArea.width;
  } else if (bounds.y < workArea.y) {
    position = 'TOP';
    gap = bounds.height - workArea.height;
  } else if (bounds.width > workArea.width) {
    position = 'RIGHT';
    gap = bounds.width - workArea.width;
  } else {
    position = 'BOTTOM';
    gap = bounds.height - workArea.height;
  }

  return { position, gap };
}

export function repositionPanel(window: BrowserWindow, panelSize: IPanelSize) {
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const taskbar = taskbarPosition();

    if (window) {
      if (taskbar.position === 'LEFT') {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + taskbar.gap,
          y: primaryDisplay.bounds.y + primaryDisplay.workArea.height - panelSize.height,
        });
      } else if (taskbar.position === 'TOP') {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + taskbar.gap,
        });
      } else {
        window.setBounds({
          width: panelSize.width,
          height: panelSize.height,
          x: primaryDisplay.bounds.x + primaryDisplay.workArea.width - panelSize.width,
          y: primaryDisplay.bounds.y + primaryDisplay.bounds.height - panelSize.height - taskbar.gap,
        });
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Couldn't reposition panel", e);
  }
}
