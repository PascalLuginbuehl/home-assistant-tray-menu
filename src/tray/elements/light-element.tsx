import React, {
  ChangeEventHandler, useCallback, useEffect, useState,
} from 'react';
import Icon from '@mdi/react';
import { useDebouncedCallback } from 'use-debounce';
import { mdiBrightness6, mdiPalette } from '@mdi/js';
import { HexColorPicker, RgbColor, RgbColorPicker } from 'react-colorful';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { usePrevious } from 'react-use';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { LightAttributes } from '../../types/state';
import { getIconsPath } from '../../settings/routes/entities/icons';
import { sendHeight } from '../renderer';
import './slider.css';
import './colorful.css';

interface LightElementProps {
  state: IState<LightAttributes>
  entity: IEntityConfig
  refetch: () => void
}

enum OpenSettingsEnum {
  effect,
  brightness,
  color,
}

export default function LightElement(props: LightElementProps) {
  const { state, entity, refetch } = props;

  const [color, setColor] = useState<RgbColor>({ r: state.attributes.rgb_color?.[0] ?? 0, g: state.attributes.rgb_color?.[1] ?? 0, b: state.attributes.rgb_color?.[2] ?? 0 });
  const [brightness, setBrightness] = useState<number>(Math.round((state.attributes.brightness ?? 0) / 2.55));

  const [openSettings, setOpenSettings] = useState<OpenSettingsEnum | null>(null);

  // Update height after every render
  useEffect(() => {
    sendHeight();
  }, [openSettings]);

  const debouncedSave = useDebouncedCallback(
    async (newBrightness: number) => {
      await window.electronAPI.state.callServiceAction('light', 'turn_on', { entity_id: entity.entity_id, brightness: newBrightness * 2.55 });
      await refetch();
    },
    500,
  );

  const saveColor = useDebouncedCallback(async (newColor: RgbColor) => {
    setColor(newColor);
    await window.electronAPI.state.callServiceAction('light', 'turn_on', { entity_id: entity.entity_id, rgb_color: [newColor.r, newColor.g, newColor.b] });
    await refetch();
  }, 500);

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

  const handleSetOpenSettings = (toOpen: OpenSettingsEnum) => {
    if (openSettings === toOpen) {
      setOpenSettings(null);
    } else {
      setOpenSettings(toOpen);
    }
  };

  // console.log(state.state === 'unavailable');

  return (
    <div
      className="w-full"
    >
      <div className="w-full flex items-center h-[50px] px-3 hover:bg-action-hover">
        <div className="w-10">
          {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1.2} />}
        </div>

        <h2>
          {EntityUtils.getEntityName(entity, state)}
        </h2>

        <div className="flex-grow" />

        <button
          type="button"
          className="bg-text-primary/[.15] rounded-full px-3 py-[6px] leading-none font-medium text-sm mr-1 hover:bg-text-primary/[.3]"
          onClick={() => {
            handleSetOpenSettings(OpenSettingsEnum.effect);
          }}
        >
          {state.state}
        </button>

        <button
          className="group h-full px-1"
          type="button"
          onClick={() => {
            handleSetOpenSettings(OpenSettingsEnum.color);
          }}
        >
          <div
            className="rounded-full border-icon-main group-hover:border-icon-hover border-2 h-6 w-6"
            style={{ background: `rgb(${color.r} ${color.g} ${color.b})` }}
          />
        </button>

        <button
          className="text-icon-main hover:text-icon-hover h-full px-1"
          type="button"
          onClick={() => {
            handleSetOpenSettings(OpenSettingsEnum.brightness);
          }}
        >
          <BrightnessMediumIcon />
        </button>
      </div>

      { openSettings === OpenSettingsEnum.color && (
        <div className="py-2 px-3">
          <RgbColorPicker color={color} onChange={saveColor} className="colorful" />
        </div>
      )}

      {openSettings === OpenSettingsEnum.effect && (
        <div className="max-h-64 overflow-x-auto">
          {state.attributes.effect_list?.map((option) => (
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

      {openSettings === OpenSettingsEnum.brightness && (
        <div
          className="py-2 px-3"
          onWheel={onWheel}
        >
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
      )}
    </div>
  );
}
