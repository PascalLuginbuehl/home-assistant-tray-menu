import axios from 'axios';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';
import EntitiesForm from './entities-form';
import Connection from './connection';
import IState from '../interfaces/IState';

async function checkApiUrl(apiURL: string, token: string) {
  const { data } = await axios.get(`${apiURL}/api/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
}

async function fetchStates(apiUrl: string, token: string) {
  const { data } = await axios.get<IState[]>(
    `${apiUrl}/api/states`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return data;
}

export default function App() {
  const { data: settings, isSuccess, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: window.electronAPI.store.getSettings,
  });

  const saveSettings = (newSettings: Partial<ISettings>) => {
    if (!isSuccess) {
      return;
    }

    window.electronAPI.store.setSettings({ ...settings, ...newSettings });
  };

  const {
    data: states, isSuccess: isSuccessStates, isError: isErrorStates, refetch: refetchStates,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => {
      if (!settings?.hassApiUrl || !settings.longLivedAccessToken) {
        return Promise.reject(new Error('No tokens given'));
      }

      return fetchStates(settings.hassApiUrl, settings.longLivedAccessToken);
    },
    retry: false,
    enabled: !!settings?.hassApiUrl && !!settings?.longLivedAccessToken,
  });

  if (!isSuccess) {
    return 'Loading';
  }

  return (
    <Box p={1}>
      <Connection
        settings={settings}
        onSave={async (newSettings) => {
          saveSettings(newSettings);
          try {
            await checkApiUrl(newSettings.hassApiUrl, newSettings.longLivedAccessToken);

            await refetch();
            refetchStates();
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Form submit failed', e);
          }
        }}
      />

      {(!isSuccessStates || isErrorStates) ? (
        <Typography>Could not fetch</Typography>
      ) : (
        <EntitiesForm
          entities={settings.entities}
          onSave={(newSettings) => {
            saveSettings({ entities: newSettings });
          }}
          states={states}
        />
      )}
    </Box>
  );
}
