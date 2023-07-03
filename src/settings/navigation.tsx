import {
  Divider,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import APIUrlStateEnum from '../types/api-state-enum';
import { useSettings } from '../utils/use-settings';
import ListItemLink from './components/list-item-link';

const drawerWidth = 240;
export default function Navigation() {
  const { apiURLState } = useSettings();

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
      <List disablePadding>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {apiURLState === APIUrlStateEnum.ok ? <TaskAltIcon color="success" /> : <CancelIcon color="error" />}
          </ListItemIcon>
          <ListItemText primary="API Status" />
        </ListItem>
        <Divider />
        <ListItemLink to="/">
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="Entities" />
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
