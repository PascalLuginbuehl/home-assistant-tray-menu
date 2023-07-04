import Grid from '@mui/material/Unstable_Grid2';
import {
  FormContainer, SwitchElement, TextFieldElement, useForm,
} from 'react-hook-form-mui';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useSettings } from '../../../utils/use-settings';
import { ISettings } from '../../../store';
import APIUrlStateEnum from '../../../types/api-state-enum';
import SubmitButton from '../../form/submit-button';

export type TFormValues = Pick<ISettings, 'hassApiUrl' | 'longLivedAccessToken' | 'isAutoLaunchEnabled'>;

const schema: yup.ObjectSchema<TFormValues> = yup.object({
  hassApiUrl: yup.string().url().required(),
  longLivedAccessToken: yup.string().matches(/^(?:[\w-]*\.){2}[\w-]*$/, 'Does not match JWT').required(),
  isAutoLaunchEnabled: yup.boolean().required(),
})
  .required();

export default function Connection() {
  const { t } = useTranslation('CONNECTION');

  const { settings, apiURLState, saveSettings } = useSettings();

  const formDefaultProps: TFormValues = {
    hassApiUrl: settings.hassApiUrl,
    longLivedAccessToken: settings.longLivedAccessToken,
    isAutoLaunchEnabled: settings.isAutoLaunchEnabled,
  };

  const formContext = useForm<TFormValues>({
    resolver: yupResolver(schema),
    defaultValues: formDefaultProps,
  });

  const { setError } = formContext;

  useEffect(() => {
    switch (apiURLState) {
      case APIUrlStateEnum.connectionRefused:
      case APIUrlStateEnum.networkError:
        setError('hassApiUrl', { message: t('NETWORK_ERROR') });
        break;

      case APIUrlStateEnum.badRequest:
        setError('longLivedAccessToken', { message: t('LLAT_UNAUTHORIZED') });
        break;

      default:
        break;
    }
  }, [apiURLState, setError, t]);

  return (
    <FormContainer<TFormValues>
      formContext={formContext}
      onSuccess={async (newSettings) => {
        await saveSettings(newSettings);
        // await refetch();
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>{t('TITLE')}</Typography>
        </Grid>
        <Grid xs={12}>
          <TextFieldElement<TFormValues> name="hassApiUrl" label="HASS URL" placeholder="http://homeassistant.local:8123" fullWidth helperText=" " />
        </Grid>
        <Grid xs={12}>
          <TextFieldElement
            name="longLivedAccessToken"
            label={t('LONG_LIVED_ACCESS_TOKEN')}
            fullWidth
            multiline
            helperText=" "
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </Grid>

        <Grid xs={12}>
          <SwitchElement<TFormValues> name="isAutoLaunchEnabled" label={t('LAUNCH_AT_STARTUP')} />
        </Grid>

        <Grid xs={12}>
          <SubmitButton>
            {t('TEST_CONNECTION')}
          </SubmitButton>
        </Grid>
      </Grid>
    </FormContainer>
  );
}
