import IState from '../types/state';

const mockState: Array<Omit<IState, 'last_changed' | 'last_updated' | 'context'>> = [
  {
    entity_id: 'switch.pascal_bedroom_light',
    state: 'on',
    attributes: {
      friendly_name: 'Pascal Light',
    },
  },
  {
    entity_id: 'switch.pascal_bedroom_corner_lamp',
    state: 'off',
    attributes: {
      friendly_name: 'Pascal Corner Lamp',
    },
  },
  {
    entity_id: 'switch.corridor_led_strip',
    state: 'off',
    attributes: {
      friendly_name: 'Corridor LED Strip',
    },
  },
  {
    entity_id: 'sensor.bedroom_co2',
    state: '796.0',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: 'ppm',
      device_class: 'carbon_dioxide',
      friendly_name: 'Bedroom Carbon dioxide',
    },
  },
  {
    entity_id: 'sensor.bedroom_temperature',
    state: '25.9',
    attributes: {
      state_class: 'measurement',
      unit_of_measurement: '°C',
      device_class: 'temperature',
      friendly_name: 'Bedroom Temperature',
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
    entity_id: 'light.wled_pascal',
    state: 'unavailable',
    attributes: {
      effect_list: [
        'Android',
        'Wipe Random',
      ],
      supported_color_modes: [
        'rgb',
      ],
      icon: 'mdi:led-strip-variant',
      friendly_name: 'WLED Pascal',
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
        'rgb',
      ],
      color_mode: 'rgb',
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
      friendly_name: 'WLED Pascal',
      supported_features: 36,
    },
  }, {
    entity_id: 'select.wled_pascal_preset',
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
    entity_id: 'number.wled_pascal_speed',
    state: '128',
    attributes: {
      min: 0,
      max: 255,
      step: 1,
      mode: 'auto',
      icon: 'mdi:speedometer',
      friendly_name: 'WLED Pascal Speed',
    },
  }, {
    entity_id: 'button.wled_pascal_restart',
    state: 'unknown',
    attributes: {
      device_class: 'restart',
      friendly_name: 'WLED Pascal Restart',
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

export default mockState as IState[];
