import { LampIcon } from '@fluentui/react-icons-mdl2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import React from 'react';

const settings = window.electronAPI.store.getSettings();

const baseApiClient = axios.create({
  baseURL: settings.hassApiUrl,
});

baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';
baseApiClient.defaults.headers.common.Authorization = `Bearer ${settings.longLivedAccessToken}`;

function serviceAction(domain: string, service: string, serviceData: unknown) {
  return baseApiClient.post(
    `/api/services/${domain}/${service}`,
    serviceData,
  );
}

async function fetchStates() {
  const { data } = await baseApiClient.get<IState[]>('/api/states');

  return data;
}

interface IState {
  'attributes': unknown
  'entity_id': string
  'last_changed': string
  'last_updated': string
  'state': string
}

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
},
{
  label: 'Bedroom',
  icon: 'ceiling-light@2x.png',
  action: {
    domain: 'switch',
    service: 'toggle',
    serviceData: {
      entity_id: 'switch.pascal_bedroom_light',
    },
  },
},
{
  label: '3D Printer',
  icon: 'ceiling-light@2x.png',
  action: {
    domain: 'switch',
    service: 'toggle',
    serviceData: {
      entity_id: 'switch.corridor_led_strip',
    },
  },
},
];

export default function App() {
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const states = await fetchStates();
      return states.filter((state) => configuration.map((e) => e.action.serviceData.entity_id).includes(state.entity_id));
    },
    suspense: true,
  });

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="window-base">
      <div className="titlebar">
        <h2 className="title">Hello from React!</h2>
      </div>

      {configuration.map(({ label, action }) => (
        <button
          type="button"
          key={label}
          className={
            clsx(
              'actionButton',
              data
                .find((d) => action.serviceData.entity_id === d.entity_id)
                ?.state === 'on'
                && 'selected',
            )
          }
          onClick={async () => {
            await serviceAction(action.domain, action.service, action.serviceData);
            await refetch();
          }}
        >
          <LampIcon />
          {label}
        </button>
      ))}
    </div>
  );
}
