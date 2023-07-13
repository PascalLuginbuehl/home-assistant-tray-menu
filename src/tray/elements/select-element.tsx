import React, { useState } from 'react';
import Icon from '@mdi/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SelectAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';

interface SelectElementProps {
  state: IState<SelectAttributes>
  entity: IEntityConfig
  refetch: () => void
}

export default function SelectElement(props: SelectElementProps) {
  const { state, entity, refetch } = props;

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <>
      <div
        className={`w-full hover:bg-gray-500 py-2 px-3 flex items-center hover:bg-action-hover ${state?.state === 'on' && 'bg-accent-dark hover:bg-accent-dark/70'}`}
      >
        <div className="w-10 min-h-[32px]">
          {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
        </div>
        <h2>
          {EntityUtils.getEntityName(entity, state)}
          {state.state}
        </h2>
        <div className="flex-grow" />
        <button type="button" onClick={() => setExpanded(!expanded)}>
          <ExpandLessIcon />
        </button>
      </div>
      {state.attributes.options.map((option) => (
        <button
          type="button"
          className={`w-full hover:bg-gray-500 py-2 px-3 flex items-center hover:bg-action-hover ${state?.state === option && 'bg-accent-dark hover:bg-accent-dark/70'}`}
        >
          {option}
        </button>
      ))}
    </>
  );
}
