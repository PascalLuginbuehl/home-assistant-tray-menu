import React, {
  ChangeEventHandler, useEffect, useState,
} from 'react';
import Icon from '@mdi/react';
import { useDebouncedCallback } from 'use-debounce';
import { mdiBrightness6 } from '@mdi/js';
import { RgbColor, RgbColorPicker } from 'react-colorful';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSettings } from '../../utils/use-settings';
import { IEntityConfig } from '../../store';
import EntityUtils from '../../utils/entity-utils';
import IState, { ColorModeEnum, LightAttributes, SwitchAttributes } from '../../types/state';
import { sendHeight } from '../send-height';
import './slider.css';
import './colorful.css';
import SwitchElement from './switch-element';
import ElementIcon from './element-icon';

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

  const { systemAttributes: { computedOsTheme } } = useSettings();

  const [color, setColor] = useState<RgbColor>({ r: state.attributes.rgb_color?.[0] ?? 0, g: state.attributes.rgb_color?.[1] ?? 0, b: state.attributes.rgb_color?.[2] ?? 0 });
  const [brightness, setBrightness] = useState<number>(Math.round((state.attributes.brightness ?? 0) / 2.55));

  const [openSettings, setOpenSettings] = useState<OpenSettingsEnum | null>(null);

  // reinitialize with new data from the server
  useEffect(() => {
    setColor({ r: state.attributes.rgb_color?.[0] ?? 0, g: state.attributes.rgb_color?.[1] ?? 0, b: state.attributes.rgb_color?.[2] ?? 0 });
    setBrightness(Math.round((state.attributes.brightness ?? 0) / 2.55));
  }, [state]);

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

  const supportedColorModes = state.attributes.supported_color_modes;

  if (supportedColorModes?.includes(ColorModeEnum.RGB) || supportedColorModes?.includes(ColorModeEnum.RGBW) || supportedColorModes?.includes(ColorModeEnum.RGBWW)) {
    return (
      <div
        className={clsx({
          'pointer-events-none opacity-50': state.state === 'unavailable',
        })}
      >
        <div
          className={clsx(
            'flex h-[50px] w-full items-center hover:bg-action-hover',
            {
              'rounded-lg': computedOsTheme === 'win11',
            },
          )}
        >
          <button
            type="button"
            className={clsx(
              'box-content h-full w-7 px-3 hover:bg-action-hover',
              {
                'rounded-lg': computedOsTheme === 'win11',
              },
            )}
            onClick={async () => {
              await window.electronAPI.state.callServiceAction('light', 'toggle', { entity_id: entity.entity_id });
              await refetch();
            }}
          >
            <ElementIcon iconName={entity.icon || state.attributes.icon} />
          </button>

          <h2>
            {EntityUtils.getEntityName(entity, state)}
          </h2>

          <div className="grow" />

          {state.attributes.effect !== undefined && (
            <button
              type="button"
              className="mr-1 rounded-full bg-text-primary/[.15] px-3 py-[6px] text-sm font-medium leading-none hover:bg-text-primary/[.3]"
              onClick={() => {
                handleSetOpenSettings(OpenSettingsEnum.effect);
              }}
            >
              { state.attributes.effect }
            </button>
          )}

          {state.attributes.rgb_color !== undefined && (
            <button
              className="group h-full px-1"
              type="button"
              onClick={() => {
                handleSetOpenSettings(OpenSettingsEnum.color);
              }}
            >
              <div
                className="h-6 w-6 rounded-full border-2 border-icon-main group-hover:border-icon-hover"
                style={{ background: `rgb(${color.r} ${color.g} ${color.b})` }}
              />
            </button>
          )}

          {state.attributes.brightness !== undefined && (
            <button
              className="h-full px-1 text-icon-main hover:text-icon-hover"
              type="button"
              onClick={() => {
                handleSetOpenSettings(OpenSettingsEnum.brightness);
              }}
            >
              <BrightnessMediumIcon />
            </button>
          )}
          <div className="w-3" />
        </div>

        { openSettings === OpenSettingsEnum.color && (
        <div className="px-3 py-2">
          <RgbColorPicker color={color} onChange={saveColor} className="colorful" />
        </div>
        )}

        {openSettings === OpenSettingsEnum.effect && (
        <div className="max-h-64 overflow-x-auto">
          {state.attributes.effect_list?.map((effect) => (
            <button
              key={effect}
              type="button"
              className={twMerge(clsx(
                'flex w-full items-center px-3 py-2',
                'hover:bg-action-hover',
                {
                  'bg-accent-main text-accent-mainContrastText hover:bg-accent-main/70 hover:text-accent-mainContrastText': state?.attributes.effect === effect,
                },
              ))}
              onClick={async () => {
                await window.electronAPI.state.callServiceAction('light', 'turn_on', { entity_id: entity.entity_id, effect });
                await refetch();
              }}
            >
              {effect}
            </button>
          ))}
        </div>
        )}

        {openSettings === OpenSettingsEnum.brightness && (
        <div
          className="px-3 py-2"
          onWheel={onWheel}
        >
          <div className="flex w-full items-center">
            <button className="appearance-none pl-2 pr-4" type="button">
              <Icon path={mdiBrightness6} size={0.8} />
            </button>
            <div className="custom-slider relative h-[36px] grow">
              <input
                className="group h-full w-full appearance-none bg-transparent"
                type="range"
                min={0}
                max={100}
                value={brightness}
                onChange={onChangeBrightness}
              />
              <div className="pointer-events-none absolute top-[calc(50%-1px)] h-[2px] bg-accent-main" style={{ width: `${brightness}%` }} />
            </div>
            <h2 className="-mr-1 w-[52px] pl-2 text-center text-xl">{brightness}</h2>
          </div>
        </div>
        )}
      </div>
    );
  }

  if (supportedColorModes?.includes(ColorModeEnum.ONOFF)) {
    return <SwitchElement entity={entity} state={state as IState<SwitchAttributes>} refetch={refetch} />;
  }

  if (supportedColorModes?.includes(ColorModeEnum.BRIGHTNESS)) {
    return <div>TODO: implement</div>;
  }

  return <div>{`Color mode ${supportedColorModes} not supported`}</div>;
}
