import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SelectAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';
import { sendHeight } from '../renderer';

interface SelectElementProps {
  state: IState<SelectAttributes>
  entity: IEntityConfig
  refetch: () => void
}

export default function SelectElement(props: SelectElementProps) {
  const { state, entity, refetch } = props;

  const [expanded, setExpanded] = useState<boolean>(false);

  // Update height after every render
  useEffect(() => {
    sendHeight();
  }, [expanded]);

  return (
    <>
      <button
        className={`w-full hover:bg-gray-500 h-[50px] px-3 flex items-center hover:bg-action-hover ${state?.state === 'on' && 'bg-accent-dark hover:bg-accent-dark/70'}`}
        type="button"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10">
          {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
        </div>
        <h2 className="flex gap-1">
          {EntityUtils.getEntityName(entity, state)}
        </h2>
        <div className="flex-grow" />
        <div className="bg-text-primary/[.15] rounded-full px-3 py-[6px] leading-none font-medium text-sm mr-1">{state.state}</div>
        <div className={`${!expanded && 'rotate-180'}`}>
          <ExpandLessIcon />
        </div>
      </button>
      {expanded && (
        <div className="max-h-64 overflow-x-auto">
          {state.attributes.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`w-full hover:bg-gray-500 py-2 px-3 flex items-center ${state?.state === option ? 'bg-accent-main hover:bg-accent-dark/70' : 'hover:bg-action-hover'}`}
              onClick={async () => {
                await window.electronAPI.state.callServiceAction('select', 'select_option', { entity_id: entity.entity_id, option });
                await refetch();
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
