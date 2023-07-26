import { ipcMain, nativeTheme, systemPreferences } from 'electron';
import APIUrlStateEnum from './types/api-state-enum';
import { setIconStatus } from './windows/tray';
import { baseApiClient, checkAPIUrl, setAxiosParameters } from './hass-api';
import store, { ISettings, setAutoLaunch } from './store';
import IState from './types/state';
import { mockState, mockConfigEntities } from './mocks/mock-state';
import getComputedOsTheme from './windows/get-os-theme';

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

ipcMain.handle('settings:get', async () => {
  const settings = store.get('settings');

  if (settings.development.useMockConfig) {
    return { ...settings, entities: mockConfigEntities };
  }

  return settings;
});

ipcMain.handle('settings:set', async (event, value) => {
  const settings = value as ISettings;

  store.set('settings', value);

  // Set the theme of the app to match the one set in development settings
  nativeTheme.themeSource = settings.development.theme;

  // Adjust the auto launch setting
  setAutoLaunch(settings.isAutoLaunchEnabled);
});

export interface SystemAttributes {
  accentColor: string;
  computedOsTheme: 'win10' | 'win11';
}

ipcMain.handle('system-attributes:get', async () => ({ accentColor: systemPreferences.getAccentColor(), computedOsTheme: getComputedOsTheme() }));
