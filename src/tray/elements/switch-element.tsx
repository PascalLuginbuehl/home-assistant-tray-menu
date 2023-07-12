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
}
