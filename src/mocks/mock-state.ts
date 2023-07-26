import { IEntityConfig } from '../store';
import IState, { ColorModeEnum } from '../types/state';

const mockStateArray: Array<Omit<IState, 'last_changed' | 'last_updated' | 'context'>> = [
  {
    entity_id: 'switch.light',
    state: 'on',
    attributes: {
      friendly_name: 'Light',
    },
  }, {
    entity_id: 'switch.corridor_led_strip',
    state: 'off',
    attributes: {
      friendly_name: 'Corridor LED Strip',
    },
  },
  {
    entity_id: 'sensor.co2',
    state: '796.0',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: 'ppm',
      device_class: 'carbon_dioxide',
      friendly_name: 'Carbon dioxide',
    },
  },
  {
    entity_id: 'sensor.temperature',
    state: '25.9',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: '°C',
      device_class: 'temperature',
      friendly_name: 'Temperature',
    },
  },
  {
    entity_id: 'sensor.pixel_7_battery_level',
    state: '57',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: '%',
      device_class: 'battery',
      icon: 'mdi:battery-50',
      friendly_name: 'Pixel 7 Battery Level',
    },
  }, {
    entity_id: 'light.wled_unavailable',
    state: 'unavailable',
    attributes: {
      effect_list: [
        'Android',
        'Wipe Random',
      ],
      supported_color_modes: [
        ColorModeEnum.RGB,
      ],
      icon: 'mdi:led-strip-variant',
      friendly_name: 'WLED Unavailable',
      supported_features: 36,
    },
  }, {
    entity_id: 'light.wled',
    state: 'on',
    attributes: {
      effect_list: [
        'Android',
        'Wipe Random',
      ],
      supported_color_modes: [
        ColorModeEnum.RGB,
      ],
      color_mode: ColorModeEnum.RGB,
      brightness: 128,
      hs_color: [
        37.647,
        100,
      ],
      rgb_color: [
        255,
        160,
        0,
      ],
      xy_color: [
        0.569,
        0.411,
      ],
      effect: 'Solid',
      icon: 'mdi:led-strip-variant',
      friendly_name: 'WLED',
      supported_features: 36,
    },
  }, {
    entity_id: 'light.only_toggle',
    state: 'on',
    attributes: {
      supported_color_modes: [
        ColorModeEnum.ONOFF,
      ],
      color_mode: ColorModeEnum.ONOFF,
      icon: 'mdi:led-strip-variant',
      friendly_name: 'Only toggle light',
    },
  }, {
    entity_id: 'select.wled_preset',
    state: 'unknown',
    attributes: {
      options: [
        'Rainbow',
        'Solid White',
      ],
      icon: 'mdi:playlist-play',
      friendly_name: 'WLED Pascal Preset',
    },
  }, {
    entity_id: 'number.wled_speed',
    state: '128',
    attributes: {
      min: 0,
      max: 255,
      step: 1,
      mode: 'auto',
      icon: 'mdi:speedometer',
      friendly_name: 'WLED Speed Number',
    },
  }, {
    entity_id: 'button.wled_restart',
    state: 'unknown',
    attributes: {
      device_class: 'restart',
      friendly_name: 'WLED Restart Button',
    },
  }, {
    entity_id: 'automation.switch',
    state: 'on',
    attributes: {
      id: '1670607092099',
      last_triggered: '2023-01-09T20:17:24.919777+00:00',
      mode: 'single',
      current: 0,
      friendly_name: 'Switch',
    },
  }, {
    entity_id: 'binary_sensor.pixel_7_is_charging',
    state: 'off',
    attributes: {
      device_class: 'plug',
      icon: 'mdi:power-plug-off',
      friendly_name: 'Pixel 7 Is Charging',
    },
  },
];

const mockEntities: Partial<IEntityConfig>[] = [{
  entity_id: 'sensor.co2',
  icon: 'molecule-co2',
}, {
  entity_id: 'sensor.temperature',
  icon: 'home-thermometer-outline',
}, {
  icon: 'cellphone-charging',
  entity_id: 'sensor.pixel_7_battery_level',
}, {
  entity_id: 'switch.light',
  icon: 'wall-sconce-flat-outline',
}, {
  entity_id: 'switch.corridor_led_strip',
  icon: 'led-strip-variant',
}, {
  entity_id: 'light.wled_unavailable',
}, {
  entity_id: 'light.wled',
  icon: 'desk',
}, {
  entity_id: 'select.wled_preset',
  icon: 'led-strip-variant',
}, {
  entity_id: 'number.wled_speed',
}, {
  entity_id: 'button.wled_restart',
}, {
  entity_id: 'automation.switch',
}, {
  entity_id: 'light.only_toggle',
}, {
  entity_id: 'binary_sensor.pixel_7_is_charging',
}];

export const mockConfigEntities = mockEntities.map((entity) => ({
  label: null,
  icon: null,
  ...entity,
} as IEntityConfig));

export const mockState = mockStateArray as IState[];
