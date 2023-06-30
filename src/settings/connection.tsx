import Grid from '@mui/material/Unstable_Grid2';
import {
  CheckboxElement, FormContainer, TextFieldElement, useForm,
} from 'react-hook-form-mui';
import React from 'react';
import { Button } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';
import { ISettings } from '../store';

export type TFormValues = Pick<ISettings, 'hassApiUrl' | 'longLivedAccessToken' | 'isAutoLaunchEnabled'>;

const schema: yup.ObjectSchema<TFormValues> = yup.object({
  hassApiUrl: yup.string().url().required(),
  longLivedAccessToken: yup.string().matches(/^(?:[\w-]*\.){2}[\w-]*$/, 'Does not match JWT').required(),
  isAutoLaunchEnabled: yup.boolean().required(),
})
  .required();

interface ConnectionProps {
  settings: ISettings
  onSaveSettings: (values: TFormValues) => void
}

export default function Connection(props: ConnectionProps) {
  const { settings, onSaveSettings } = props;
  const { t } = useTranslation('SETTINGS');

  const formDefaultProps: TFormValues = {
    hassApiUrl: settings.hassApiUrl,
    longLivedAccessToken: settings.longLivedAccessToken,
    isAutoLaunchEnabled: settings.isAutoLaunchEnabled,
  };

  const formContext = useForm<TFormValues>({
    resolver: yupResolver(schema),
    defaultValues: formDefaultProps,
  });

  const { setError, formState: { isSubmitting } } = formContext;

  return (
    <FormContainer<TFormValues>
      formContext={formContext}
      onSuccess={async (newSettings) => {
        await onSaveSettings(newSettings);

        try {
          await axios.get(`${newSettings.hassApiUrl}/api/`, {
            headers: {
              Authorization: `Bearer ${newSettings.longLivedAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            if (e.code === 'ERR_NETWORK') {
              setError('hassApiUrl', { message: t('NETWORK_ERROR') });
            } else if (e.code && e.code === 'ERR_BAD_REQUEST') {
              setError('longLivedAccessToken', { message: t('LLAT_UNAUTHORIZED') });
            }
          }
        }
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <TextFieldElement<TFormValues> name="hassApiUrl" label="HASS URL" placeholder="http://homeassistant.local:8123" fullWidth helperText=" " />
        </Grid>
        <Grid xs={12}>
          <TextFieldElement<TFormValues> name="longLivedAccessToken" label={t('LONG_LIVED_ACCESS_TOKEN')} fullWidth multiline helperText=" " />
        </Grid>

        <Grid xs={12}>
          <CheckboxElement<TFormValues> name="isAutoLaunchEnabled" label={t('LAUNCH_AT_STARTUP')} />
        </Grid>

        <Grid xs={12}>
          <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
            {t('TEST_CONNECTION')}
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
  );
}
