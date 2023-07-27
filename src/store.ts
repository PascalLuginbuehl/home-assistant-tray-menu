import Store from 'electron-store';
import { JSONSchemaType } from 'ajv';

export interface IEntityConfig {
  entity_id: string,
  icon: string | null,
  label: string | null,
}
export interface ISettings {
  longLivedAccessToken: string
  hassApiUrl: string
  isAutoLaunchEnabled: boolean
  entities: IEntityConfig[]
  development: {
    keepTrayWindowOpen: boolean
    useMockBackend: boolean
    useMockConfig: boolean
  }
  general: {
    theme: 'system' | 'light' | 'dark'
    osTheme: 'system' | 'win10' | 'win11'
    trayIconColor: 'system' | 'white' | 'black'
  }
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
        general: {
          type: 'object',
          properties: {
            theme: {
              type: 'string',
              default: 'system',
            },
            osTheme: {
              type: 'string',
              default: 'system',
            },
            trayIconColor: {
              type: 'string',
              default: 'system',
            },
          },
          default: {
            theme: 'system', osTheme: 'system', trayIconColor: 'system',
          },
          required: ['theme', 'osTheme', 'trayIconColor'],
        },
        development: {
          type: 'object',
          properties: {
            keepTrayWindowOpen: {
              type: 'boolean',
              default: false,
            },
            useMockBackend: {
              type: 'boolean',
              default: false,
            },
            useMockConfig: {
              type: 'boolean',
              default: false,
            },
          },
          default: {
            keepTrayWindowOpen: false, useMockBackend: false, useMockConfig: false,
          },
          required: ['keepTrayWindowOpen', 'useMockBackend', 'useMockConfig'],
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
      required: ['longLivedAccessToken', 'hassApiUrl', 'entities', 'isAutoLaunchEnabled', 'development'],
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
      development: {
        keepTrayWindowOpen: false,
        useMockBackend: false,
        useMockConfig: false,
      },
      general: {
        theme: 'system',
        osTheme: 'system',
        trayIconColor: 'system',
      },
    },
  },
});

export default store;
