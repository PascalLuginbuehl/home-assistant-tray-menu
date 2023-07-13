import React, { ChangeEventHandler, useState } from 'react';
import Icon from '@mdi/react';
import { useDebouncedCallback } from 'use-debounce';
import { mdiBrightness6, mdiPalette } from '@mdi/js';
import { HexColorPicker } from 'react-colorful';
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
  const [color, setColor] = useState('#aabbcc');

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
    const scrollChange = (event.deltaY / 50) * -1;

    const newBrightness = Math.min(
      Math.max(
        brightness + scrollChange,
        0,
      ),
      100,
    );

    setBrightness(newBrightness);
    debouncedSave(newBrightness);
  };

  return (
    <div
      className="py-2 px-3 w-full"
      onWheel={onWheel}
    >
      <div className="w-full flex items-center">
        <div className="w-10 min-h-[32px]">
          {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
        </div>

        <h2>
          {EntityUtils.getEntityName(entity, state)}
        </h2>
        <div className="flex-1" />

        <button className="rounded" type="button">
          <Icon path={mdiPalette} size={0.8} />
        </button>
      </div>
      <div>
        <HexColorPicker color={color} onChange={setColor} />
        <div className="flex w-full items-center">
          <button className="pl-2 pr-4 appearance-none" type="button">
            <Icon path={mdiBrightness6} size={0.8} />
          </button>
          <div className="custom-slider relative h-[36px] grow">
            <input
              className="appearance-none bg-transparent w-full h-full group"
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={onChangeBrightness}
            />
            <div className="bg-accent-main h-[2px] absolute top-[calc(50%-1px)] pointer-events-none" style={{ width: `${brightness}%` }} />
          </div>
          <h2 className="text-center text-xl pl-2 w-[52px] -mr-1">{brightness}</h2>
        </div>
      </div>
    </div>
  );
}
