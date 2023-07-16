import Grid from '@mui/material/Unstable_Grid2';
import {
  FormContainer, SelectElement, SubmitHandler, SwitchElement, useForm,
} from 'react-hook-form-mui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useSettings } from '../../../utils/use-settings';
import { ISettings } from '../../../store';
import AutoSave from '../../components/form/auto-save';

export type TFormValues = ISettings['development'];

export default function Development() {
  const { t } = useTranslation('DEVELOPMENT');

  const { settings, saveSettings } = useSettings();

  const formDefaultValues = useMemo<TFormValues>(() => ({
    keepTrayWindowOpen: settings.development.keepTrayWindowOpen,
    useMockBackend: settings.development.useMockBackend,
    theme: settings.development.theme,
  }), [settings]);

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
          <SelectElement<TFormValues>
            name="theme"
            label={t('OVERWRITE_THEME')}
            options={[{ id: 'system', label: 'System' }, { id: 'light', label: 'light' }, { id: 'dark', label: 'dark' }]}
            fullWidth
          />
        </Grid>

        <AutoSave
          onSubmit={onSaveFunction}
        />
      </Grid>
    </FormContainer>
  );
}
