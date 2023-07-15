import {
  Box,
  Divider,
  Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip,
} from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';
import { mdiHomeAssistant } from '@mdi/js';
import BugReportIcon from '@mui/icons-material/BugReport';
import APIUrlStateEnum from '../types/api-state-enum';
import { useSettings } from '../utils/use-settings';
import ListItemLink from './components/list-item-link';

const drawerWidth = 240;
export default function Navigation() {
  const { settings, apiURLState } = useSettings();
  const { t } = useTranslation();

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
      <List disablePadding sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ListItem secondaryAction={(
          <Tooltip title="Open Home Assistant in Browser">
            <IconButton href={settings.hassApiUrl} target="_blank">
              <Icon path={mdiHomeAssistant} size={1} />
            </IconButton>
          </Tooltip>
          )}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {apiURLState === APIUrlStateEnum.ok ? <TaskAltIcon color="success" /> : <CancelIcon color="error" />}
          </ListItemIcon>
          <ListItemText primary={t('GENERIC:API_STATUS')} />

        </ListItem>
        <Divider />
        <ListItemLink to="/">
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary={t('ENTITIES:TITLE')} />
        </ListItemLink>
        <ListItemLink to="/connection">
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('CONNECTION:TITLE')} />
        </ListItemLink>
        <Box sx={{ flexGrow: 1 }} />
        <ListItemLink to="/development">
          <ListItemIcon sx={{ minWidth: 36, opacity: 0.2 }}>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText primary={t('DEVELOPMENT:TITLE')} sx={{ opacity: 0.2 }} />
        </ListItemLink>
      </List>
    </Drawer>
  );
}
