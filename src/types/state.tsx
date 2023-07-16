export interface CommonAttributes {
  friendly_name: string
  icon?: string
}

export enum ColorModeEnum {
  UNKNOWN = 'unknown',
  ONOFF = 'onoff',
  BRIGHTNESS = 'brightness',
  COLOR_TEMP = 'color_temp',
  HS = 'hs',
  RGB = 'rgb',
  RGBW = 'rgbw',
  RGBWW = 'rgbww',
  WHITE = 'white',
  XY = 'xy',
}

export interface LightAttributes {
  brightness?: number
  color_mode?: ColorModeEnum
  effect?: string
  effect_list?: string[]
  hs_color?: [number, number]
  rgb_color?: [number, number, number]
  supported_color_modes?: ColorModeEnum[]
  supported_features?: number
  xy_color?: [number, number]
}

export interface SensorAttributes {
  device_class?: string
  state_class?: string
  unit_of_measurement?: string
}

export interface NumberAttributes {
  max: number
  min: number
  mode: string
  step: number
}

export interface AutomationAttributes {
  id: string,
  last_triggered: string,
  mode: string,
  current: 0,
}

export interface SelectAttributes {
  options: string[]
}

export type SwitchAttributes = Record<string, never>;

export type CombinedAttributes = LightAttributes | SensorAttributes | NumberAttributes | SelectAttributes | SwitchAttributes | AutomationAttributes;

export default interface IState<IAttributes extends CombinedAttributes = CombinedAttributes> {
  entity_id: string
  state: string
  attributes: IAttributes & CommonAttributes
  last_changed: string
  last_updated: string
  context: {
    id: string
    parent_id: string | null
    user_id: string | null
  }
}
