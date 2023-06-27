import axios from 'axios';
import React, { useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
  const settings = window.electronAPI.store.getSettings();
  const transformedSettings = { ...settings, entityIds: settings.entities.map((e) => e.entity_id) };

  const [apiUrl, setApiUrl] = useState<string | null>(settings.hassApiUrl);
  const [token, setToken] = useState<string | null>(settings.longLivedAccessToken);

  return (
    <Box p={1}>
      <FormContainer<TFormValues>
        defaultValues={transformedSettings}
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
