import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CheckboxElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';
import ManageSwitches from './manage-switches';

async function checkApiUrl(apiURL: string, token: string) {
  const { data } = await axios.get(`${apiURL}/api/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export interface TFormValues extends Omit<ISettings, 'entities'> {
  selectSwitch: string | null
  entityIds: string[]
}

export function App() {
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ['settings'],
    queryFn: window.electronAPI.store.getSettings,
  });

  useEffect(() => {
    if (isSuccess) {
      setApiUrl(data.hassApiUrl);
      setToken(data.longLivedAccessToken);
    }
  }, [isSuccess, data]);

  if (!isSuccess) {
    return 'Loading';
  }

  const formDefaultValues = {
    ...data,
    entityIds: data.entities.map((e) => e.entity_id),
    enabledAutoStart: false,
  };

  return (
    <Box p={1}>
      <FormContainer<TFormValues>
        defaultValues={formDefaultValues}
        onSuccess={async (values) => {
          const transformedValues: ISettings = { ...values, entities: values.entityIds.map((e) => ({ entity_id: e })) };

          window.electronAPI.store.setSettings(transformedValues);
          try {
            await checkApiUrl(values.hassApiUrl, values.longLivedAccessToken);
            setApiUrl(values.hassApiUrl);
            setToken(values.longLivedAccessToken);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Form submit failed', e);
          }
        }}
      >
        <Grid container spacing={1}>
          <Grid xs={12}>
            <TextFieldElement<TFormValues> name="hassApiUrl" label="HASS URL" placeholder="http://homeassistant.local:8123" fullWidth />
          </Grid>
          <Grid xs={12}>
            <TextFieldElement<TFormValues> name="longLivedAccessToken" label="Long Lived Access Token" fullWidth />
          </Grid>

          <Grid xs={12}>
            <CheckboxElement<TFormValues> name="isAutoLaunchEnabled" label="Enable Autostart" />
          </Grid>

          <Grid xs={12}>
            <Button type="submit" color="primary" variant="contained">
              Test connection
            </Button>
          </Grid>
        </Grid>
        <ManageSwitches apiUrl={apiUrl} token={token} />
      </FormContainer>
    </Box>
  );
}
