import React from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';
import EntitiesForm from './entities-form';
import Connection from './connection';

export default function App() {
  const { data: settings, isSuccess, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => window.electronAPI.store.getSettings(),
  });

  const {
    data: states, isSuccess: isSuccessStates, isError: isErrorStates, refetch: refetchStates,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => window.electronAPI.state.getStates(),
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
