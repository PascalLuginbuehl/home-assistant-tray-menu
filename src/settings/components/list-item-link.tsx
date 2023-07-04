import React from 'react';

import {
  LinkProps, Link, useMatch,
} from 'react-router-dom';

import { ListItem, ListItemButton } from '@mui/material';

export interface DrawerListItemLinkProps extends LinkProps {
  children: React.ReactNode
}

const ListItemLinkComponent = React.forwardRef<HTMLAnchorElement, LinkProps>((componentProps, ref) => (
  <Link
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...componentProps}
    ref={ref}
  />
));

ListItemLinkComponent.displayName = 'ListItemLinkThing';

export default function ListItemLink(props: DrawerListItemLinkProps): JSX.Element {
  const {
    children,
    ...linkProps
  } = props;

  // Match without query parameters
  const selected = useMatch(linkProps.to.toString()) !== null;

  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        component={ListItemLinkComponent}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...linkProps}
        sx={(theme) => ({
          '&.Mui-selected': {
            backgroundColor: theme.palette.background.default,
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            paddingLeft: `calc(${theme.spacing(2)} - 3px)`,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.background.default,
            },
          },
        })}
      >
        {children}
      </ListItemButton>
    </ListItem>
  );
}
