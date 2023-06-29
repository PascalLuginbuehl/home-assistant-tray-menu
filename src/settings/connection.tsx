import Grid from '@mui/material/Unstable_Grid2';
import {
  CheckboxElement, FormContainer, TextFieldElement,
} from 'react-hook-form-mui';
import React from 'react';
import { Button } from '@mui/material';
import { ISettings } from '../store';

export type TFormValues = Pick<ISettings, 'hassApiUrl' | 'longLivedAccessToken' | 'isAutoLaunchEnabled'>;

interface ConnectionProps {
  settings: ISettings
  onSave: (values: TFormValues) => void
}

export default function Connection(props: ConnectionProps) {
  const { settings, onSave } = props;

  const formDefaultProps: TFormValues = {
    hassApiUrl: settings.hassApiUrl,
    longLivedAccessToken: settings.longLivedAccessToken,
    isAutoLaunchEnabled: settings.isAutoLaunchEnabled,
  };

  return (
    <FormContainer<TFormValues>
      defaultValues={formDefaultProps}
      onSuccess={async (values) => {
        onSave(values);
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
    </FormContainer>
  );
}
