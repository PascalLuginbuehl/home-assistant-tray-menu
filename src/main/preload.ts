import { contextBridge, ipcRenderer } from "electron"
import store, { ISettings } from "../store"

const contextBridgeApi = {
  registerUpdateCallback: (callback: () => void) => {
    ipcRenderer.on('settings', () => {
      callback()
    })
  },
  saveSettings: (settings: ISettings) => {
    ipcRenderer.send("settings:save")
    store.set("settings", settings)
  },
  loadSettings: () => {
    store.get("settings")
  }
}

export type ContextBridgeApi = typeof contextBridgeApi

//register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi)
