import axios, { AxiosError } from 'axios';
import store, { ISettings } from './store';
import APIUrlStateEnum from './types/api-state-enum';
import { setIconStatus } from './windows/tray';

export const baseApiClient = axios.create();
baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';

export const setAxiosParameters = (storeSettings: ISettings) => {
  baseApiClient.defaults.baseURL = storeSettings.hassApiUrl;
  baseApiClient.defaults.headers.common.Authorization = `Bearer ${storeSettings.longLivedAccessToken}`;
};

setAxiosParameters(store.get('settings'));

export const checkAPIUrl = async (hassApiUrl: string, longLivedAccessToken: string): Promise<APIUrlStateEnum> => {
  try {
    await axios.get('/api/', {
      headers: {
        Authorization: `Bearer ${longLivedAccessToken}`,
        'Content-Type': 'application/json',
      },
      baseURL: hassApiUrl,
    });

    return APIUrlStateEnum.ok;
  } catch (e) {
    if (e instanceof AxiosError && e.code && Object.values(APIUrlStateEnum).includes(e.code as APIUrlStateEnum)) {
      return e.code as APIUrlStateEnum;
    }

    throw e;
  }
};

export const checkAPIStatusPeriodically = async () => {
  const settings = store.get('settings');

  const status = await checkAPIUrl(settings.hassApiUrl, settings.longLivedAccessToken);
  setIconStatus(status);
  setTimeout(checkAPIStatusPeriodically, 5 * 60 * 1000);
};
