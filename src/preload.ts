import { contextBridge, ipcRenderer } from 'electron';
import { SchemaType } from './store';
import IState from './types/state';
import APIUrlStateEnum from './types/api-state-enum';

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
    getSettings: (): Promise<SchemaType['settings']> => ipcRenderer.invoke('electron-store:get', 'settings'),
    setSettings: async (settings: SchemaType['settings']) => {
      ipcRenderer.send('reload-api', settings);
      return ipcRenderer.invoke('electron-store:set', 'settings', settings);
    },
  },
  checkAPIUrl: (apiUrl: string, llat: string): Promise<APIUrlStateEnum> => ipcRenderer.invoke('checkAPIUrl', apiUrl, llat),
  state: {
    getStates: async (): Promise<IState[]> => ipcRenderer.invoke('state:get-states'),
    callServiceAction: async (
      domain: string,
      service: string,
      serviceData: { entity_id: string } & Record<string, unknown>,
    ): Promise<void> => ipcRenderer.invoke('service:call-action', domain, service, serviceData),
  },
  getAccentColor: async (): Promise<string> => ipcRenderer.invoke('system:accent'),
};

export type ContextBridgeApi = typeof contextBridgeApi;

// register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi);
