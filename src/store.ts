import Store from 'electron-store';
import { JSONSchemaType } from 'ajv';
import { app } from 'electron';

export interface IEntityConfig {
  entity_id: string,
  // domain: 'switch',
  // service: 'toggle',
  icon: string | null,
  label: string | null,
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
              label: {
                // https://github.com/ajv-validator/ajv/issues/2163#issuecomment-1440299363
                type: ['string', 'null'] as unknown as 'string',
                default: null,
              },
              icon: {
                // https://github.com/ajv-validator/ajv/issues/2163#issuecomment-1440299363
                type: ['string', 'null'] as unknown as 'string',
                default: null,
              },
            },
            required: ['entity_id', 'label'],
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

export async function setAutoLaunch(state: boolean) {
  // Don't set autoLaunch for dev environment
  if (app.isPackaged) {
    return;
  }

  const { openAtLogin } = await app.getLoginItemSettings();
  app.getLoginItemSettings();

  if (openAtLogin === state) {
    return;
  }

  app.setLoginItemSettings({ openAtLogin: state });
}

// Set auto-launch state
setAutoLaunch(store.get('settings').isAutoLaunchEnabled);

export default store;
