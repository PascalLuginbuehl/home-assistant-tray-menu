import clsx from 'clsx';
import React from 'react';
import Icon from '@mdi/react';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SwitchAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';

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
      className={`w-full h-[50px] px-3 flex items-center ${state?.state === 'on' ? 'bg-accent-dark hover:bg-accent-dark/70' : 'hover:bg-action-hover'} ${state.state === 'unavailable' && 'opacity-50 pointer-events-none'}`}
      onClick={async () => {
        await window.electronAPI.state.callServiceAction('switch', 'toggle', { entity_id: entity.entity_id });
        await refetch();
      }}
    >
      <div className="w-10">
        {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
      </div>
      <h2>
        {EntityUtils.getEntityName(entity, state)}
      </h2>
    </button>
  );
}
