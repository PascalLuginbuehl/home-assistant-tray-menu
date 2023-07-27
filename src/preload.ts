import { contextBridge, ipcRenderer } from 'electron';
import { SchemaType } from './store';
import IState from './types/state';
import APIUrlStateEnum from './types/api-state-enum';
import { SystemAttributes } from './ipc-main-handlers';
import { IRelease } from './updates';

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
    getSettings: (): Promise<SchemaType['settings']> => ipcRenderer.invoke('settings:get'),
    setSettings: async (settings: SchemaType['settings']) => {
      ipcRenderer.send('reload-api', settings);
      return ipcRenderer.invoke('settings:set', settings);
    },
  },
  getSystemAttributes: (): Promise<SystemAttributes> => ipcRenderer.invoke('system-attributes:get'),
  checkAPIUrl: (apiUrl: string, llat: string): Promise<APIUrlStateEnum> => ipcRenderer.invoke('checkAPIUrl', apiUrl, llat),
  state: {
    getStates: async (): Promise<IState[]> => ipcRenderer.invoke('state:get-states'),
    callServiceAction: async (
      domain: string,
      service: string,
      serviceData: { entity_id: string } & Record<string, unknown>,
    ): Promise<void> => ipcRenderer.invoke('service:call-action', domain, service, serviceData),
  },
  getLatestsVersion: (): Promise<IRelease | null> => ipcRenderer.invoke('get-latest-version'),
};

export type ContextBridgeApi = typeof contextBridgeApi;

// register functions for security reasons
contextBridge.exposeInMainWorld('electronAPI', contextBridgeApi);
