import Store from 'electron-store'
import { JSONSchemaType } from 'ajv'

export interface ISettings {
  longLivedAccessToken: string | null,
  hassURL: string | null,
  entityIds: string[]
}

export type SchemaType = {
  settings: ISettings
}

const schema: JSONSchemaType<SchemaType> = {
  type: 'object',
  properties: {
    settings: {
      type: "object",
      properties: {
        longLivedAccessToken: {
          // workaround from https://github.com/ajv-validator/ajv/issues/2163#issuecomment-1440299363
          type: ['string', 'null'] as unknown as 'string',
        },
        hassURL: {
          type: ['string', 'null'] as unknown as 'string',
        },
        entityIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: []
        },
      },
      required: ["entityIds"]
    }
  },
  required: ["settings"],
}

export const STORE_KEYS: { [key: string]: keyof SchemaType } = {
  SETTINGS: 'settings',
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const store = new Store<SchemaType>({ schema })

export default store
