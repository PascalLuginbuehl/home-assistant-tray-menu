import React from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Icon from '@mdi/react';
import { getIconsPath } from '../settings/routes/manage-switches/icons';
import EntityUtils from '../utils/entity-utils';

export default function Configuration() {
  const { data: entities, isSuccess: isSuccessEntities } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => window.electronAPI.store.getSettings(),
    select: (res) => res.entities,
    suspense: true,
  });

  const { data: states, isSuccess, refetch } = useQuery({
    queryKey: ['states'],
    refetchOnWindowFocus: true,
    staleTime: 1 * 60 * 1000,
    queryFn: async () => window.electronAPI.state.getStates(),
    select: (fetchedStates) => fetchedStates.filter((state) => entities?.map((e) => e.entity_id).includes(state.entity_id)),
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
                await window.electronAPI.state.callServiceAction('switch', 'toggle', { entity_id: entity.entity_id });
                await refetch();
              }}
            >
              <div className="spacing">
                {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1} />}
              </div>
              <span>
                {EntityUtils.getEntityName(entity, state)}
              </span>
            </button>
          );
        })
      }
    </>
  );
}
