import Store from 'electron-store';
import { JSONSchemaType } from 'ajv';
import { ipcMain } from 'electron';

export interface ISettings {
  longLivedAccessToken: string,
  hassApiUrl: string,
  entityIds: string[]
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
        entityIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: [],
        },
      },
      required: ['longLivedAccessToken', 'hassApiUrl', 'entityIds'],
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
      entityIds: [],
      hassApiUrl: '',
      longLivedAccessToken: '',
    },
  },
});

export const createStoreEvents = () => {
  // IPC listener
  ipcMain.on('electron-store-get', async (event, val) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = store.get(val);
  });

  ipcMain.on('electron-store-set', async (event, key, val) => {
    store.set(key, val);
  });
};

export default store;
