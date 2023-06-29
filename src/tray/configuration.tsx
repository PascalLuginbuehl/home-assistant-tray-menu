import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LampIcon } from '@fluentui/react-icons-mdl2';
import clsx from 'clsx';
import axios from 'axios';
import IState from '../interfaces/IState';
import EntityUtils from '../utils/entity-utils';

const baseApiClient = axios.create();

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
  const { data: entities, isSuccess: isSuccessEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const settings = await window.electronAPI.store.getSettings();
      baseApiClient.defaults.baseURL = settings.hassApiUrl;

      baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';
      baseApiClient.defaults.headers.common.Authorization = `Bearer ${settings.longLivedAccessToken}`;

      return settings.entities;
    },
    suspense: true,
  });

  const { data: states, isSuccess, refetch } = useQuery({
    queryKey: ['states'],
    refetchOnWindowFocus: true,
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const fetchedStates = await fetchStates();
      if (!entities) {
        return [];
      }
      // Optimize performence
      return fetchedStates.filter((state) => entities.map((e) => e.entity_id).includes(state.entity_id));
    },
    suspense: true,
    enabled: isSuccessEntities,
  });

  if (!isSuccess || !isSuccessEntities) {
    return null;
  }

  return (
    <>
      {
        entities.map((entity) => {
          const state = EntityUtils.getState(entity, states);
          return (
            <button
              type="button"
              key={entity.entity_id}
              className={
                clsx(
                  'actionButton',
                  state?.state === 'on'
                  && 'selected',
                )
              }
              onClick={async () => {
                await serviceAction('switch', 'toggle', { entity_id: entity.entity_id });
                await refetch();
              }}
            >
              <LampIcon />
              {EntityUtils.getEntityName(entity, state)}
            </button>
          );
        })
      }
    </>
  );
}
