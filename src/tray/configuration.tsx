import React from 'react';
import { useQuery } from '@tanstack/react-query';
import EntityUtils from '../utils/entity-utils';
import SwitchElement from './elements/switch-element';
import LightElement from './elements/light-element';
import SensorElement from './elements/sensor-element';
import SelectElement from './elements/select-element';

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

  if (entities.length === 0) {
    return (
      <div style={{ height: 100, padding: 24 }}>
        No entities configured
      </div>
    );
  }

  return entities.map((entity) => {
    const state = EntityUtils.getState(entity, states);

    if (!state) {
      return null;
    }

    if (EntityUtils.isSwitchType(state)) {
      return (
        <SwitchElement
          key={entity.entity_id}
          state={state}
          entity={entity}
          refetch={refetch}
        />
      );
    }

    if (EntityUtils.isLightType(state)) {
      return (
        <LightElement
          key={entity.entity_id}
          state={state}
          entity={entity}
        />
      );
    }

    if (EntityUtils.isSensorType(state)) {
      return (
        <SensorElement
          key={entity.entity_id}
          state={state}
          entity={entity}
          refetch={refetch}
        />
      );
    }

    if (EntityUtils.isSelectType(state)) {
      return (
        <SelectElement
          key={entity.entity_id}
          state={state}
          entity={entity}
          refetch={refetch}
        />
      );
    }

    return null;
  });
}
