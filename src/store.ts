import Store from 'electron-store';
import { JSONSchemaType } from 'ajv';
import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';

export interface IEntityConfig {
  entity_id: string,
  // domain: 'switch',
  // service: 'toggle',
  // label: string,
}
export interface ISettings {
  longLivedAccessToken: string,
  hassApiUrl: string,
  isAutoLaunchEnabled: boolean
  entities: IEntityConfig[]
}

export type SchemaType = {
  settings: ISettings
};

const schema: JSONSchemaType<SchemaType> = {
  type: 'object',
  properties: {
    settings: {
      type: 'object',
      properties: {
        longLivedAccessToken: {
          type: 'string',
          default: '',
        },
        hassApiUrl: {
          type: 'string',
          default: '',
        },
        isAutoLaunchEnabled: {
          type: 'boolean',
          default: true,
        },
        entities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              entity_id: {
                type: 'string',
              },
            },
            required: ['entity_id'],
          },
          default: [],
        },
      },
      required: ['longLivedAccessToken', 'hassApiUrl', 'entities', 'isAutoLaunchEnabled'],
    },
  },
  required: ['settings'],
};

export const STORE_KEYS: { [key: string]: keyof SchemaType } = {
  SETTINGS: 'settings',
};

const store = new Store<SchemaType>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  schema: schema.properties,
  defaults: {
    settings: {
      entities: [],
      hassApiUrl: '',
      longLivedAccessToken: '',
      isAutoLaunchEnabled: true,
    },
  },
});

const appAutoLauncher = new AutoLaunch({
  name: 'Home Assistant Tray Menu',
});

async function setAutoLaunch(state: boolean) {
  const isEnabled = await appAutoLauncher.isEnabled();

  if (isEnabled === state) {
    return;
  }

  if (state) {
    appAutoLauncher.enable();
    // eslint-disable-next-line no-console
    console.debug('auto-launch enabled');
  } else {
    appAutoLauncher.disable();
    // eslint-disable-next-line no-console
    console.debug('auto-launch disabled');
  }
}

// Set auto-launch state
setAutoLaunch(store.get('settings').isAutoLaunchEnabled);

export const createStoreEvents = () => {
  // IPC listener
  ipcMain.handle('electron-store:get', async (event, val) => store.get(val));

  ipcMain.on('electron-store:set', async (event, key, val) => {
    store.set(key, val);

    if (key === 'settings') {
      setAutoLaunch(val.isAutoLaunchEnabled);
    }
  });
};

export default store;
