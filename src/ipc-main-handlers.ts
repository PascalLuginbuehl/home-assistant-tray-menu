import { ipcMain, systemPreferences } from 'electron';
import { setOsTheme, setAutoLaunch } from './windows/startup';
import APIUrlStateEnum from './types/api-state-enum';
import { setIconStatus } from './windows/tray';
import { baseApiClient, checkAPIUrl, setAxiosParameters } from './hass-api';
import store, { ISettings } from './store';
import IState from './types/state';
import { mockState, mockConfigEntities } from './mocks/mock-state';
import getComputedOsTheme from './windows/get-os-theme';
import checkForUpdates from './updates';

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

ipcMain.handle('settings:set', async (event, value: ISettings) => {
  const settings = value;

  // Prevent from overwriting the entities with the mock ones
  const previousSettings = store.get('settings');
  if (settings.development.useMockConfig || previousSettings.development.useMockConfig) {
    settings.entities = previousSettings.entities;
  }

  store.set('settings', settings);

  // Set the theme of the app to match the one set in development settings
  setOsTheme(settings.general.theme);

  // Adjust the auto launch setting
  setAutoLaunch(settings.isAutoLaunchEnabled);

  setIconStatus(APIUrlStateEnum.ok);
});

export interface SystemAttributes {
  accentColor: string;
  computedOsTheme: 'win10' | 'win11';
}

ipcMain.handle('system-attributes:get', async () => ({ accentColor: systemPreferences.getAccentColor(), computedOsTheme: getComputedOsTheme() }));

ipcMain.handle('get-latest-version', () => checkForUpdates());
