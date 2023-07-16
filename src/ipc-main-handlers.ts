import { ipcMain, nativeTheme, systemPreferences } from 'electron';
import os from 'os';
import APIUrlStateEnum from './types/api-state-enum';
import { setIconStatus } from './windows/tray';
import { baseApiClient, checkAPIUrl, setAxiosParameters } from './hass-api';
import store, { ISettings, setAutoLaunch } from './store';
import IState from './types/state';
import { mockState, mockConfigEntities } from './mocks/mock-state';

// From https://github.com/xanderfrangos/twinkle-tray/blob/d238796f2cbe3c521a12df46fabedff6adee115b/src/electron.js#L52C1-L53C76
const isReallyWin11 = parseInt(os.release()?.split('.')[2], 10) >= 22000;

const handleError = (e: unknown) => {
  setIconStatus(APIUrlStateEnum.badRequest);
  throw e;
};

const handleAPIStatus = <T>(data: T): T => {
  setIconStatus(APIUrlStateEnum.ok);
  return data;
};

ipcMain.handle(
  'checkAPIUrl',
  async (event, hassApiUrl: string, longLivedAccessToken: string) => checkAPIUrl(hassApiUrl, longLivedAccessToken)
    .then(handleAPIStatus)
    .catch(handleError),
);

ipcMain.handle(
  'service:call-action',
  (event, domain: string, service: string, serviceData: { entity_id: string }) => {
    if (store.get('settings').development.useMockBackend) {
      return Promise.resolve();
    }

    return baseApiClient.post(`/api/services/${domain}/${service}`, serviceData)
      .then((response) => response.data)
      .then(handleAPIStatus)
      .catch(handleError);
  },
);

ipcMain.on('reload-api', (event, storeSettings: ISettings) => {
  setAxiosParameters(storeSettings);
});

ipcMain.handle(
  'state:get-states',
  () => {
    if (store.get('settings').development.useMockBackend) {
      return Promise.resolve(mockState);
    }

    return baseApiClient.get<IState[]>('/api/states')
      .then((response) => response.data)
      .then(handleAPIStatus)
      .catch(handleError);
  },
);

// electron-store
ipcMain.handle('electron-store:get', async (event, val) => {
  if (val === 'settings') {
    const settings = store.get('settings');

    if (settings.development.useMockConfig) {
      return { ...settings, entities: mockConfigEntities };
    }

    return settings;
  }

  return store.get(val);
});

ipcMain.handle('electron-store:set', async (event, key, val) => {
  store.set(key, val);

  if (key === 'settings') {
    const settings = val as ISettings;
    nativeTheme.themeSource = settings.development.theme;
    setAutoLaunch(settings.isAutoLaunchEnabled);
  }
});

ipcMain.handle('system:accent', async () => systemPreferences.getAccentColor());
ipcMain.handle('get-win-version:get', async () => isReallyWin11);
