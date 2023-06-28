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
    getSettings: async (): Promise<SchemaType['settings']> => {
      const result = await ipcRenderer.invoke('electron-store:get', 'settings');
      return result;
    },
    setSettings: (value: SchemaType['settings']) => {
      ipcRenderer.send('electron-store:set', 'settings', value);
    },
  },
};

export type ContextBridgeApi = typeof contextBridgeApi;

// register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi);
