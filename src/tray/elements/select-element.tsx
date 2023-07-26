import React, { useEffect, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSettings } from '../../utils/use-settings';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { SelectAttributes } from '../../types/state';
import { sendHeight } from '../send-height';
import ElementIcon from './element-icon';

interface SelectElementProps {
  state: IState<SelectAttributes>
  entity: IEntityConfig
  refetch: () => void
}

export default function SelectElement(props: SelectElementProps) {
  const { state, entity, refetch } = props;

  const { systemAttributes: { computedOsTheme } } = useSettings();
  const [expanded, setExpanded] = useState<boolean>(false);

  // Update height after every render
  useEffect(() => {
    sendHeight();
  }, [expanded]);

  return (
    <div className={clsx({
      'pointer-events-none opacity-50': state.state === 'unavailable',
    })}
    >
      <button
        className={clsx(
          'flex h-[50px] w-full items-center px-3 hover:bg-action-hover',
          {
            'rounded-lg': computedOsTheme === 'win11',
          },
        )}
        type="button"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10">
          <ElementIcon iconName={entity.icon || state.attributes.icon} />
        </div>
        <h2 className="flex gap-1">
          {EntityUtils.getEntityName(entity, state)}
        </h2>
        <div className="grow" />
        <div className="mr-1 rounded-full bg-text-primary/[.15] px-3 py-[6px] text-sm font-medium leading-none">{state.state}</div>
        <div className={`${!expanded && 'rotate-180'}`}>
          <ExpandLessIcon />
        </div>
      </button>
      {expanded && state.state !== 'unavailable' && (
        <div className="max-h-64 overflow-x-auto">
          {state.attributes.options.map((option) => (
            <button
              key={option}
              type="button"
              className={twMerge(clsx(
                'flex w-full items-center px-3 py-2',
                'hover:bg-action-hover',
                {
                  'bg-accent-main text-accent-mainContrastText hover:bg-accent-main/70': state?.state === option,
                },
              ))}
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
    </div>
  );
}
