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
      className={`w-full hover:bg-gray-500 py-2 px-3 flex items-center ${state?.state === 'on' && 'bg-blue-500'}`}
      onClick={async () => {
        await window.electronAPI.state.callServiceAction('switch', 'toggle', { entity_id: entity.entity_id });
        await refetch();
      }}
    >
      <div className="w-10 min-h-[32px]">
        {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
      </div>
      <h2>
        {EntityUtils.getEntityName(entity, state)}
      </h2>
    </button>
  );
}
