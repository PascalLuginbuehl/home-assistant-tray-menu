import axios from 'axios';
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';
import EntitiesForm from './entities-form';
import Connection, { TFormValues } from './connection';
import IState from '../interfaces/IState';

const baseApiClient = axios.create();
baseApiClient.defaults.headers.common['Content-Type'] = 'application/json';

async function checkApiUrl(apiURL: string, token: string) {
  const { data } = await axios.get(`${apiURL}/api/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
}

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

  const {
    isError, mutateAsync: setApiUrl, isLoading,
  } = useMutation({
    mutationFn: async (newSettings: TFormValues) => {
      await saveSettings(newSettings);
      try {
        await checkApiUrl(newSettings.hassApiUrl, newSettings.longLivedAccessToken);
      } catch (e) {
        throw new Error('API URL oder Long lived access token invalid');
      } finally {
        await refetch();
        await refetchStates();
      }
    },
  });

  if (!isSuccess) {
    return 'Loading settings';
  }

  return (
    <Box p={1}>
      <Connection
        settings={settings}
        onSave={async (newSettings) => {
          await setApiUrl(newSettings);
        }}
      />
      {isLoading && <CircularProgress />}
      {isError && <Typography>Some error occured</Typography>}

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
