import { contextBridge, ipcRenderer } from 'electron';
import { SchemaType } from './store';

const contextBridgeApi = {
  registerUpdateCallback: (callback: () => void) => {
    ipcRenderer.on('settings', () => {
      callback();
    });
  },
  registerHeightRequestCallback: (callback: () => void) => {
    ipcRenderer.on('request-height', () => {
      callback();
    });
  },
  sendHeight: (height: number) => {
    ipcRenderer.send('panel-height', height);
  },
  store: {
    getSettings(): SchemaType['settings'] {
      // TODO: use invoke here instead
      return ipcRenderer.sendSync('electron-store-get', 'settings');
    },
    setSettings(value: SchemaType['settings']) {
      ipcRenderer.send('electron-store-set', 'settings', value);
    },
  },
};

export type ContextBridgeApi = typeof contextBridgeApi;

// register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi);
