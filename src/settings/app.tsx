import axios from 'axios';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';
import EntitiesForm from './entities-form';
import Connection from './connection';
import IState from '../interfaces/IState';

const baseApiClient = axios.create();
baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';

async function fetchStates() {
  const { data } = await baseApiClient.get<IState[]>('/api/states');
  return data;
}

export default function App() {
  const { data: settings, isSuccess, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const storeSettings = await window.electronAPI.store.getSettings();
      baseApiClient.defaults.baseURL = storeSettings.hassApiUrl;

      baseApiClient.defaults.headers.common.Authorization = `Bearer ${storeSettings.longLivedAccessToken}`;

      return storeSettings;
    },
  });

  const {
    data: states, isSuccess: isSuccessStates, isError: isErrorStates, refetch: refetchStates,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => fetchStates(),
    retry: false,
    enabled: !!settings?.hassApiUrl && !!settings?.longLivedAccessToken,
  });

  const saveSettings = async (newSettings: Partial<ISettings>) => {
    if (!isSuccess) {
      return;
    }
    await window.electronAPI.store.setSettings({ ...settings, ...newSettings });
  };

  if (!isSuccess) {
    return 'Loading settings';
  }

  return (
    <Box p={1}>
      <Connection
        settings={settings}
        onSaveSettings={async (newSettings) => {
          await saveSettings(newSettings);
          await refetch();
          await refetchStates();
        }}
      />

      {(!isSuccessStates || isErrorStates) ? (
        <Typography>Could not fetch</Typography>
      ) : (
        <EntitiesForm
          entities={settings.entities}
          onSave={async (entities) => {
            await saveSettings({ entities });
          }}
          states={states}
        />
      )}
    </Box>
  );
}
