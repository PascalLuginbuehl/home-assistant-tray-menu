import Grid from '@mui/material/Unstable_Grid2';
import {
  FormContainer, SelectElement, SubmitHandler, SwitchElement, useForm,
} from 'react-hook-form-mui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../../../utils/use-settings';
import { ISettings } from '../../../store';
import AutoSave from '../../components/form/auto-save';

export type TFormValues = ISettings['development'];

export default function Development() {
  const { t } = useTranslation('DEVELOPMENT');

  const { settings, saveSettings } = useSettings();

  const formDefaultValues = useMemo<TFormValues>(() => (settings.development), [settings]);

  const formContext = useForm<TFormValues>({
    defaultValues: formDefaultValues,
  });

  const { reset } = formContext;

  // reinitialize by hand
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

  const onSaveFunction = useCallback<SubmitHandler<TFormValues>>((newSettings) => {
    saveSettings({ development: newSettings });
  }, [saveSettings]);

  // Display all states of entities in a textfield
  const {
    data: states,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => window.electronAPI.state.getStates(),
    // select only states that are in settings.entities
    select: (data) => data.filter((e) => settings.entities.map((entities) => entities.entity_id).includes(e.entity_id)),
    retry: false,
  });

  return (
    <FormContainer<TFormValues>
      formContext={formContext}
    >
      <Grid container spacing={0} gap={1}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>{t('TITLE')}</Typography>
        </Grid>

        <Grid xs={12}>
          <SwitchElement<TFormValues> name="keepTrayWindowOpen" label={t('KEEP_TRAY_OPEN')} />
        </Grid>

        <Grid xs={12}>
          <SwitchElement<TFormValues> name="useMockBackend" label={t('USE_MOCK_BACKEND')} />
        </Grid>

        <Grid xs={12}>
          <SwitchElement<TFormValues> name="useMockConfig" label={t('USE_CONFIG')} />
        </Grid>

        <Grid xs={12}>
          <SelectElement<TFormValues>
            name="theme"
            label={t('OVERWRITE_THEME')}
            options={[{ id: 'system', label: 'System' }, { id: 'light', label: 'light' }, { id: 'dark', label: 'dark' }]}
            fullWidth
          />
        </Grid>

        <Grid xs={12}>
          <SelectElement<TFormValues>
            name="osTheme"
            label={t('OPERATING_SYSTEM_THEME')}
            options={[{ id: 'system', label: 'System' }, { id: 'win10', label: 'Windows 10' }, { id: 'win11', label: 'Windows 11' }]}
            fullWidth
          />
        </Grid>

        <Grid xs={12}>
          <Typography variant="h4">Raw State Data</Typography>

          <Box component="pre" whiteSpace="pre-wrap" fontSize="small">
            {JSON.stringify(states, (key, value) => {
            // filter out last_changed last_updated context
              const filteredKeys = ['last_changed', 'last_updated', 'context'];
              if (filteredKeys.includes(key)) {
                return undefined;
              }
              return value;
            }, 2)}
          </Box>
        </Grid>

        <AutoSave
          onSubmit={onSaveFunction}
        />
      </Grid>
    </FormContainer>
  );
}
