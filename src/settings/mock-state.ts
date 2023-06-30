import IState from '../types/state';

const mockState: IState[] = [
  {
    entity_id: 'switch.pascal_bedroom_light',
    state: 'on',
    attributes: {
      friendly_name: 'Pascal Light',
    },
    last_changed: '2023-06-28T11:08:50.702125+00:00',
    last_updated: '2023-06-28T11:08:50.702125+00:00',
    context: {
      id: '01H40V264EGF2VKMTZGY4EP138',
      parent_id: null,
      user_id: null,
    },
  },
  {
    entity_id: 'switch.pascal_bedroom_corner_lamp',
    state: 'off',
    attributes: {
      friendly_name: 'Pascal Corner Lamp',
    },
    last_changed: '2023-06-28T10:38:13.982604+00:00',
    last_updated: '2023-06-28T10:38:13.982604+00:00',
    context: {
      id: '01H40SA4DMRXGX0SEHCJEEVH09',
      parent_id: '01H40SA4D7NVKTV99X3HPHEA8F',
      user_id: null,
    },
  },
  {
    entity_id: 'switch.corridor_led_strip',
    state: 'off',
    attributes: {
      friendly_name: 'Corridor LED Strip',
    },
    last_changed: '2023-06-28T07:57:43.646989+00:00',
    last_updated: '2023-06-28T07:57:43.646989+00:00',
    context: {
      id: '01H40G47TDQATSCBVC5GB0TCWK',
      parent_id: null,
      user_id: 'eef3171b7d1244258e04c8cfb1a0709a',
    },
  },
  {
    entity_id: 'switch.on_off_plug_in_unit_5',
    state: 'off',
    attributes: {
      friendly_name: 'Lars Desk LED Strip',
    },
    last_changed: '2023-06-27T19:12:29.424329+00:00',
    last_updated: '2023-06-27T19:12:29.424329+00:00',
    context: {
      id: '01H3Z4B1P6ZJGZ5BW13G7BWMJQ',
      parent_id: '01H3Z4B1P3Z1Z7WB0X8F6JS8MK',
      user_id: null,
    },
  },
  {
    entity_id: 'switch.on_off_plug_in_unit_6',
    state: 'off',
    attributes: {
      friendly_name: 'Lars Bed LED Strip',
    },
    last_changed: '2023-06-26T14:08:14.820248+00:00',
    last_updated: '2023-06-26T14:08:14.820248+00:00',
    context: {
      id: '01H3W0H7Z4FXHZ0FFG5PGGB0H7',
      parent_id: null,
      user_id: null,
    },
  },
  {
    entity_id: 'switch.wled_nightlight',
    state: 'unavailable',
    attributes: {
      icon: 'mdi:weather-night',
      friendly_name: 'Lars Desk LED Nightlight',
    },
    last_changed: '2023-06-27T19:13:00.085067+00:00',
    last_updated: '2023-06-27T19:13:00.085067+00:00',
    context: {
      id: '01H3Z4BZNNJFRYVRVAPV82TETE',
      parent_id: null,
      user_id: null,
    },
  },
  {
    entity_id: 'switch.wled_sync_send',
    state: 'unavailable',
    attributes: {
      icon: 'mdi:upload-network-outline',
      friendly_name: 'Lars Desk LED Sync send',
    },
    last_changed: '2023-06-27T19:13:00.085315+00:00',
    last_updated: '2023-06-27T19:13:00.085315+00:00',
    context: {
      id: '01H3Z4BZNNWT86QZPMF25E9WZ5',
      parent_id: null,
      user_id: null,
    },
  },
  {
    entity_id: 'switch.wled_sync_receive',
    state: 'unavailable',
    attributes: {
      icon: 'mdi:download-network-outline',
      friendly_name: 'Lars Desk LED Sync receive',
    },
    last_changed: '2023-06-27T19:13:00.085546+00:00',
    last_updated: '2023-06-27T19:13:00.085546+00:00',
    context: {
      id: '01H3Z4BZNN8CQTCGCAMTKKKE5D',
      parent_id: null,
      user_id: null,
    },
  },
  {
    entity_id: 'switch.wled_reverse',
    state: 'unavailable',
    attributes: {
      icon: 'mdi:swap-horizontal-bold',
      friendly_name: 'Lars Desk LED Reverse',
    },
    last_changed: '2023-06-27T19:13:00.085838+00:00',
    last_updated: '2023-06-27T19:13:00.085838+00:00',
    context: {
      id: '01H3Z4BZNNBN6RRT0KW82FPKFX',
      parent_id: null,
      user_id: null,
    },
  },
];

export default mockState;
