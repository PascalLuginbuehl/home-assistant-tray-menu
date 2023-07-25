import React from 'react';
import { useQuery } from '@tanstack/react-query';
import EntityUtils from '../utils/entity-utils';
import SwitchElement from './elements/switch-element';
import LightElement from './elements/light-element';
import SensorElement from './elements/sensor-element';
import SelectElement from './elements/select-element';
import { IEntityConfig } from '../store';

interface ConfigurationProps {
  entities: IEntityConfig[]
}

export default function Configuration(props: ConfigurationProps) {
  const { entities } = props;

  const { data: states, isSuccess, refetch } = useQuery({
    queryKey: ['states'],
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 0.5 * 60 * 1000,
    refetchInterval: 15 * 1000,
    queryFn: async () => window.electronAPI.state.getStates(),
    select: (fetchedStates) => fetchedStates.filter((state) => entities?.map((e) => e.entity_id).includes(state.entity_id)),
    suspense: true,
  });

  if (!isSuccess) {
    return null;
  }

  if (entities.length === 0) {
    return (
      <div style={{ height: 100, padding: 24 }}>
        No entities configured.
        <br />
        Right-click on the tray icon to open settings.
      </div>
    );
  }

  return (
    <>
      <div className="mb-[1px] grid grid-cols-4 gap-[1px]">
        {entities.map((entity) => {
          const state = EntityUtils.getState(entity, states);

          if (!state) {
            return null;
          }

          if (EntityUtils.isSensorType(state)) {
            return (
              <SensorElement
                key={entity.entity_id}
                state={state}
                entity={entity}
              />
            );
          }

          return null;
        })}
      </div>
      {
        entities.map((entity) => {
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
                refetch={refetch}
              />
            );
          }

          if (EntityUtils.isSensorType(state)) {
            return null;
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
        })
      }
    </>
  );
}
