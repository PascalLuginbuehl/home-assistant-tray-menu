import React from 'react';
import Icon from '@mdi/react';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SensorAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';

interface SensorElementProps {
  state: IState<SensorAttributes>
  entity: IEntityConfig
  refetch: () => void
}

export default function SensorElement(props: SensorElementProps) {
  const { state, entity, refetch } = props;

  return (
    <div
      className={`w-full hover:bg-gray-500 py-2 px-3 flex items-center hover:bg-action-hover ${state?.state === 'on' && 'bg-accent-dark hover:bg-accent-dark/70'}`}
    >
      <div className="w-10 min-h-[32px]">
        {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
      </div>
      <h2>
        {EntityUtils.getEntityName(entity, state)}
      </h2>
      <div className="flex-grow" />
      <h2 className="text-xl">
        {state.state}
&nbsp;
        {state.attributes.unit_of_measurement}
      </h2>
    </div>
  );
}
