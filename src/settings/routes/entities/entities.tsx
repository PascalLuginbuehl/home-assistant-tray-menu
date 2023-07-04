import React, { useCallback, useEffect, useMemo } from 'react';
import { FormContainer, SubmitHandler, useForm } from 'react-hook-form-mui';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { IconButton, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import AutoSave from '../../components/form/auto-save';
import { useSettings } from '../../../utils/use-settings';
import { IEntityConfig } from '../../../store';
import ManageEntities from './manage-entities';

export interface TFormValues {
  entities: IEntityConfig[]
  selectSwitch: string | null
}

function Entities() {
  const { settings: { entities }, saveSettings } = useSettings();
  const { t } = useTranslation('ENTITIES');

  const {
    data: states, isSuccess: isSuccessStates, isError: isErrorStates, refetch, isRefetching,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => window.electronAPI.state.getStates(),
    select: (data) => data.filter((e) => e.entity_id.startsWith('switch.')),
    retry: false,
  });

  const formDefaultValues = useMemo<TFormValues>(() => ({
    entities,
    selectSwitch: null,
  }), [entities]);

  const formContext = useForm<TFormValues>({
    defaultValues: formDefaultValues,
  });

  const { reset } = formContext;

  // reinitialize by hand
  useEffect(() => {
    reset(formDefaultValues);
  }, [formDefaultValues, reset]);

  const onSaveFunction = useCallback<SubmitHandler<TFormValues>>((values) => {
    saveSettings({ entities: values.entities });
  }, [saveSettings]);

  if (!isSuccessStates || isErrorStates) {
    return <Typography>Could not fetch</Typography>;
  }

  return (
    <FormContainer<TFormValues>
      formContext={formContext}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>{t('TITLE')}</Typography>
        </Grid>

        <Grid xs={12}>
          <IconButton onClick={() => refetch()} disabled={isRefetching}>
            <ReplayIcon />
          </IconButton>
        </Grid>

        <Grid xs={12}>
          <ManageEntities states={states} />
        </Grid>

        <AutoSave
          onSubmit={onSaveFunction}
        />
      </Grid>
    </FormContainer>
  );
}

Entities.whyDidYouRender = true;
export default Entities;
