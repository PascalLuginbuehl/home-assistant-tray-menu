import React from 'react';
import MdiIcon from '../../components/mdi-icon';

interface ElementIconProps {
  iconName: string | undefined | null
}

export default function ElementIcon(props: ElementIconProps) {
  const { iconName } = props;

  if (!iconName) {
    return null;
  }

  return (
    <MdiIcon iconName={iconName} size={1.2} />
  );
}
