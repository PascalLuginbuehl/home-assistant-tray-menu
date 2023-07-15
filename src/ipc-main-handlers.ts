import { ipcMain, systemPreferences } from 'electron';
import APIUrlStateEnum from './types/api-state-enum';
import { setIconStatus } from './windows/tray';
import { baseApiClient, checkAPIUrl, setAxiosParameters } from './hass-api';
import store, { ISettings, setAutoLaunch } from './store';
import IState from './types/state';

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
  (event, domain: string, service: string, serviceData: { entity_id: string }) => baseApiClient.post(`/api/services/${domain}/${service}`, serviceData)
    .then((response) => response.data)
    .then(handleAPIStatus)
    .catch(handleError),
);

ipcMain.on('reload-api', (event, storeSettings: ISettings) => {
  setAxiosParameters(storeSettings);
});

ipcMain.handle(
  'state:get-states',
  () => baseApiClient.get<IState[]>('/api/states')
    .then((response) => response.data)
    .then(handleAPIStatus)
    .catch(handleError),
);

// electron-store
ipcMain.handle('electron-store:get', async (event, val) => store.get(val));

ipcMain.handle('electron-store:set', async (event, key, val) => {
  store.set(key, val);

  if (key === 'settings') {
    setAutoLaunch(val.isAutoLaunchEnabled);
  }
});

ipcMain.handle('system:accent', async () => systemPreferences.getAccentColor());
