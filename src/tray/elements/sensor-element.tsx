import React from 'react';
import clsx from 'clsx';
import { useSettings } from '../../utils/use-settings';
import { IEntityConfig } from '../../store';
import IState, { SensorAttributes } from '../../types/state';
import MdiIcon from '../../components/mdi-icon';

interface SensorElementProps {
  state: IState<SensorAttributes>
  entity: IEntityConfig
}

export default function SensorElement(props: SensorElementProps) {
  const { state, entity } = props;
  const { systemAttributes: { computedOsTheme } } = useSettings();

  return (
    <div className={
      clsx(
        'flex flex-col items-center gap-[1px] bg-text-primary/[.04] py-2 ',
        {
          'shadow-[0px_0px_0_1px_var(--tray-border)]': computedOsTheme === 'win10',
          'rounded-[8px]': computedOsTheme === 'win11',
        },
      )
}
    >
      {entity.icon && <MdiIcon iconName={entity.icon} size={1} />}
      <div className="flex gap-[2px]">
        <p className="text-lg font-medium leading-none">
          {state.state}
        </p>
        <span className="align-top text-[.65rem] font-normal leading-none">{state.attributes.unit_of_measurement}</span>
      </div>
    </div>
  );
}
