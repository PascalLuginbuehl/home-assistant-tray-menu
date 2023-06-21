import Store from 'electron-store'
import { JSONSchemaType } from 'ajv'

export interface ISettings {
  longLivedAccessToken: string,
  hassURL: string,
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
          type: "string",
        },
        hassURL: {
          type: "string",
        },
        entityIds: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      required: []
    }
  },
  required: ["settings"],
}

export const STORE_KEYS: { [key: string]: keyof SchemaType } = {
  SETTINGS: 'settings',
}


const store = new Store<SchemaType>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  schema: schema.properties,
  defaults: {
    settings: {
      entityIds: [],
      hassURL: "",
      longLivedAccessToken: ""
    }
  }
})

export default store
