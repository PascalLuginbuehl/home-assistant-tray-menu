const configuration = [{
  label: 'Bedroom Corner',
  icon: 'floor-lamp-outline@2x.png',
  action: {
    domain: 'switch',
    service: 'toggle',
    serviceData: {
      entity_id: 'switch.pascal_bedroom_corner_lamp',
    },
  },
}, {
  label: 'Bedroom',
  icon: 'ceiling-light@2x.png',
  action: {
    domain: 'switch',
    service: 'toggle',
    serviceData: {
      entity_id: 'switch.pascal_bedroom_light',
    },
  },
}, {
  label: '3D Printer',
  icon: 'ceiling-light@2x.png',
  action: {
    domain: 'switch',
    service: 'toggle',
    serviceData: {
      entity_id: 'switch.corridor_led_strip',
    },
  },
}];

export default configuration;
