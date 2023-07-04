import React from 'react';
import { FormContainer } from 'react-hook-form-mui';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { IconButton, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useSettings } from '../../../utils/use-settings';
import { IEntityConfig } from '../../../store';
import ManageEntities from './manage-entities';
import SubmitButton from '../../form/submit-button';

export interface TFormValues {
  entities: IEntityConfig[]
  selectSwitch: string | null
}

export default function Entities() {
  const { settings: { entities }, saveSettings } = useSettings();
  const { t } = useTranslation('ENTITIES');

  const {
    data: states, isSuccess: isSuccessStates, isError: isErrorStates, refetch, isRefetching,
  } = useQuery({
    queryKey: ['states'],
    queryFn: () => window.electronAPI.state.getStates(),
    retry: false,
  });

  const formDefaultValues: TFormValues = {
    entities,
    selectSwitch: null,
  };

  if (!isSuccessStates || isErrorStates) {
    return <Typography>Could not fetch</Typography>;
  }

  const filteredStates = states.filter((e) => e.entity_id.startsWith('switch.'));

  return (
    <FormContainer<TFormValues>
      defaultValues={formDefaultValues}
      onSuccess={async (values) => {
        await saveSettings({ entities: values.entities });
      }}
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
          <ManageEntities states={filteredStates} />
        </Grid>

        <Grid xs={12}>
          <SubmitButton>
            {t('SAVE_ENTITIES')}
          </SubmitButton>
        </Grid>
      </Grid>
    </FormContainer>
  );
}
