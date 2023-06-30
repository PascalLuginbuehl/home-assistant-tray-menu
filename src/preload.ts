import { contextBridge, ipcRenderer } from 'electron';
import { SchemaType } from './store';

const contextBridgeApi = {
  registerHeightRequestCallback: (callback: () => void) => {
    ipcRenderer.on('request-height', () => {
      callback();
    });
  },
  sendHeight: (height: number) => {
    ipcRenderer.send('panel-height', height);
  },
  store: {
    getSettings: async (): Promise<SchemaType['settings']> => ipcRenderer.invoke('electron-store:get', 'settings'),
    setSettings: async (value: SchemaType['settings']) => {
      ipcRenderer.send('reload');
      ipcRenderer.invoke('electron-store:set', 'settings', value);
    },
  },
};

export type ContextBridgeApi = typeof contextBridgeApi;

// register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi);
