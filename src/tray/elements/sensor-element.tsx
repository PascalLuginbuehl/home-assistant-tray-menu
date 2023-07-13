import React from 'react';
import Icon from '@mdi/react';
import { IEntityConfig } from '../../store';
import IState, { SensorAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';

interface SensorElementProps {
  state: IState<SensorAttributes>
  entity: IEntityConfig
}

export default function SensorElement(props: SensorElementProps) {
  const { state, entity } = props;

  return (
    <div className="py-2 flex flex-col items-center shadow-[0px_0px_0_1px_var(--tray-border)] bg-text-primary/[.04] gap-[1px]">
      {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1} />}
      <div className="flex gap-[2px]">
        <p className="text-lg font-medium leading-none">
          {state.state}
        </p>
        <span className="text-[.65rem] align-top leading-none font-normal">{state.attributes.unit_of_measurement}</span>
      </div>
    </div>
  );
}
