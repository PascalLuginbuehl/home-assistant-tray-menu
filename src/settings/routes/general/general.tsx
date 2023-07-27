import Grid from '@mui/material/Unstable_Grid2';
import {
  FormContainer, SelectElement, SubmitHandler, useForm,
} from 'react-hook-form-mui';
import React, {
  useCallback, useEffect, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useSettings } from '../../../utils/use-settings';
import { ISettings } from '../../../store';
import AutoSave from '../../components/form/auto-save';

export type TFormValues = ISettings['general'];

export default function General() {
  const { t } = useTranslation('GENERAL');

  const { settings, saveSettings } = useSettings();

  const formDefaultValues = useMemo<TFormValues>(() => (settings.general), [settings]);

  const formContext = useForm<TFormValues>({
    defaultValues: formDefaultValues,
  });

  const { reset } = formContext;

  // reinitialize by hand
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

  const onSaveFunction = useCallback<SubmitHandler<TFormValues>>((newSettings) => {
    saveSettings({ general: newSettings });
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
          <SelectElement<TFormValues>
            name="trayIconColor"
            label={t('TRAY_ICON_COLOR')}
            options={[{ id: 'system', label: 'System' }, { id: 'white', label: 'white' }, { id: 'black', label: 'black' }]}
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
