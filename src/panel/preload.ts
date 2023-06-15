import { contextBridge, ipcRenderer } from "electron"

const contextBridgeApi = {
  registerHeightRequestCallback: (callback: () => void) => {
    ipcRenderer.on('request-height', () => {
      callback()
    })
  },
  sendHeight: (height: number) => {
    ipcRenderer.send('panel-height', height)
  }
}

export type ContextBridgeApi = typeof contextBridgeApi

//register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi)
