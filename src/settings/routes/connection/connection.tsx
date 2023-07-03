import Grid from '@mui/material/Unstable_Grid2';
import {
  CheckboxElement, FormContainer, TextFieldElement, useForm,
} from 'react-hook-form-mui';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Typography } from '@mui/material';
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

interface ConnectionProps {
  settings: ISettings
  onSaveSettings: (values: TFormValues) => void
}

export default function Connection(props: ConnectionProps) {
  const { settings, onSaveSettings } = props;
  const { t } = useTranslation('SETTINGS');

  const { data: APIUrlState, refetch } = useQuery({
    queryKey: ['connection'],
    queryFn: () => window.electronAPI.checkAPIUrl(settings.hassApiUrl, settings.longLivedAccessToken),
  });

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
    switch (APIUrlState) {
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
  }, [APIUrlState, setError, t]);

  return (
    <FormContainer<TFormValues>
      formContext={formContext}
      onSuccess={async (newSettings) => {
        await onSaveSettings(newSettings);
        await refetch();
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Box display="flex" alignItems="center" gap={1}>
            {APIUrlState === APIUrlStateEnum.ok ? <TaskAltIcon color="success" /> : <CancelIcon color="error" />}
            <Typography>API Status</Typography>
          </Box>
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
          <CheckboxElement<TFormValues> name="isAutoLaunchEnabled" label={t('LAUNCH_AT_STARTUP')} />
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
