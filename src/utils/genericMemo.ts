import React from 'react';

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
type PropsComparator<C extends React.ComponentType> = (
  prevProps: Readonly<React.ComponentProps<C>>,
  nextProps: Readonly<React.ComponentProps<C>>
) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function genericMemo<C extends React.ComponentType<any>>(Component: C, propsComparator?: PropsComparator<C>): C {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.memo(Component, propsComparator) as any as C;
}
