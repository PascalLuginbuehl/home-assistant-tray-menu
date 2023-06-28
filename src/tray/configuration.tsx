import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LampIcon } from '@fluentui/react-icons-mdl2';
import clsx from 'clsx';
import axios from 'axios';
import { IEntityConfig } from '../store';
import IState from '../interfaces/IState';

const baseApiClient = axios.create();

let configuredEntities: IEntityConfig[] = [];
window.electronAPI.store.getSettings().then((settings) => {
  baseApiClient.defaults.baseURL = settings.hassApiUrl;

  baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';
  baseApiClient.defaults.headers.common.Authorization = `Bearer ${settings.longLivedAccessToken}`;

  configuredEntities = settings.entities;
});

function serviceAction(domain: string, service: string, serviceData: { entity_id: string }) {
  return baseApiClient.post(
    `/api/services/${domain}/${service}`,
    serviceData,
  );
}

async function fetchStates() {
  const { data } = await baseApiClient.get<IState[]>('/api/states');

  return data;
}

export default function Configuration() {
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ['states'],
    refetchOnWindowFocus: true,
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const states = await fetchStates();
      return states.filter((state) => configuredEntities.map((e) => e.entity_id).includes(state.entity_id));
    },
    suspense: true,
  });

  if (!isSuccess) {
    return null;
  }

  return (
    <>
      {
      data.map((state) => (
        <button
          type="button"
          key={state.entity_id}
          className={
            clsx(
              'actionButton',
              state.state === 'on'
              && 'selected',
            )
          }
          onClick={async () => {
            await serviceAction('switch', 'toggle', { entity_id: state.entity_id });
            await refetch();
          }}
        >
          <LampIcon />
          {state.attributes.friendly_name}
        </button>
      ))
    }
    </>
  );
}
