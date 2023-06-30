import axios, { AxiosError } from 'axios';
import { ipcMain } from 'electron';
import { IState } from 'react-use/lib/usePermission';
import store, { ISettings } from './store';
import APIUrlStateEnum from './types/api-state-enum';

const settings = store.get('settings');

const baseApiClient = axios.create();
baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';

const setSettings = (storeSettings: ISettings) => {
  baseApiClient.defaults.baseURL = storeSettings.hassApiUrl;
  baseApiClient.defaults.headers.common.Authorization = `Bearer ${storeSettings.longLivedAccessToken}`;
};

setSettings(settings);

ipcMain.on('reload-api', (event, storeSettings: ISettings) => {
  setSettings(storeSettings);
});

ipcMain.handle(
  'state:get-states',
  () => baseApiClient.get<IState[]>('/api/states').then((response) => response.data),
);

ipcMain.handle('checkAPIUrl', async (event, hassApiUrl, llat): Promise<APIUrlStateEnum> => {
  try {
    await axios.get(`${hassApiUrl}/api/`, {
      headers: {
        Authorization: `Bearer ${llat}`,
        'Content-Type': 'application/json',
      },
    });

    return APIUrlStateEnum.ok;
  } catch (e) {
    if (e instanceof AxiosError && e.code && Object.values(APIUrlStateEnum).includes(e.code as APIUrlStateEnum)) {
      return e.code as APIUrlStateEnum;
    }

    throw e;
  }
});

ipcMain.handle(
  'service:call-action',
  (event, domain: string, service: string, serviceData: { entity_id: string }) => baseApiClient.post(`/api/services/${domain}/${service}`, serviceData)
    .then((response) => response.data),
);
