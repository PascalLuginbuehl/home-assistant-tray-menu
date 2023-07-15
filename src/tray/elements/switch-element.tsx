import React from 'react';
import clsx from 'clsx';
import MdiIcon from '../../components/mdi-icon';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SwitchAttributes } from '../../types/state';

interface SwitchElementProps {
  state: IState<SwitchAttributes>
  entity: IEntityConfig
  refetch: () => void
}

export default function SwitchElement(props: SwitchElementProps) {
  const { state, entity, refetch } = props;

  return (
    <button
      type="button"
      className={clsx(
        'flex h-[50px] w-full items-center px-3',
        state?.state === 'on' ? 'bg-accent-main hover:bg-accent-main/70' : 'hover:bg-action-hover',
        state.state === 'unavailable' && 'pointer-events-none opacity-50',
      )}
      onClick={async () => {
        await window.electronAPI.state.callServiceAction('switch', 'toggle', { entity_id: entity.entity_id });
        await refetch();
      }}
    >
      <div className="w-10">
        {entity.icon && <MdiIcon iconName={entity.icon} size={1.2} />}
      </div>
      <h2>
        {EntityUtils.getEntityName(entity, state)}
      </h2>
    </button>
  );
}
