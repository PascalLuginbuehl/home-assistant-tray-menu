import clsx from 'clsx';
import React, { ChangeEventHandler, useState } from 'react';
import Icon from '@mdi/react';
import { useDebouncedCallback } from 'use-debounce';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { LightAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';

interface LightElementProps {
  state: IState<LightAttributes>
  entity: IEntityConfig
}

export default function LightElement(props: LightElementProps) {
  const { state, entity } = props;

  const [brightness, setBrightness] = useState<number>(Math.round((state.attributes.brightness ?? 0) / 2.55));

  const debouncedSave = useDebouncedCallback(
    async (newBrightness: number) => {
      await window.electronAPI.state.callServiceAction('light', 'turn_on', { entity_id: entity.entity_id, brightness: newBrightness * 2.55 });
    },
    100,
  );

  const onChangeBrightness: ChangeEventHandler<HTMLInputElement> = (event) => {
    const brighness = event.target.valueAsNumber;

    setBrightness(brighness);
    debouncedSave(brighness);
  };

  const onWheel: React.WheelEventHandler = (event) => {
    // Only divide by 50 to have faster scoll
    const scrollChange = (event.deltaY / 50);

    const newBrightness = Math.min(
      Math.max(
        brightness + scrollChange,
        0,
      ),
      255,
    );

    setBrightness(newBrightness);
    debouncedSave(newBrightness);
  };

  return (
    <div
      className={
        clsx(
          'actionButton',
          state?.state === 'on'
          && 'selected',
        )
      }
      onWheel={onWheel}
    >
      <div>
        <div className="spacing">
          {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1} />}
        </div>
        <span>
          {EntityUtils.getEntityName(entity, state)}
        </span>
        <div className="input--range">
          <input
            className="range"
            type="range"
            min={0}
            max={255}
            value={brightness}
            onChange={onChangeBrightness}
          />
          <p>{brightness}</p>
        </div>
      </div>
    </div>
  );
}
