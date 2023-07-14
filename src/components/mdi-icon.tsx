import React from 'react';
import Icon from '@mdi/react';
import { IconProps } from '@mdi/react/dist/IconProps';
import { getIconsPath } from '../settings/routes/entities/icons';

interface MdiIconProps extends Omit<IconProps, 'path'> {
  iconName: string
}

export default function MdiIcon(props: MdiIconProps) {
  const { iconName, ...iconProps } = props;

  const iconPath = getIconsPath(iconName);

  if (iconPath === null) {
    return null;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon {...iconProps} path={iconPath} />;
}
