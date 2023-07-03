import {
  Drawer, List, ListItemIcon, ListItemText,
} from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import ListItemLink from './components/list-item-link';

const drawerWidth = 240;
export default function Navigation() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItemLink to="/">
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemLink>
        <ListItemLink to="/connection">
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="API Connection" />
        </ListItemLink>
      </List>
    </Drawer>
  );
}
