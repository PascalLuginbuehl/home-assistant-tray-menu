import React from 'react';
import { FormContainer } from 'react-hook-form-mui';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { IEntityConfig } from '../store';
import ManageSwitches from './manage-switches/manage-switches';
import IState from '../types/state';
import SubmitButton from './form/submit-button';

export interface TFormValues {
  entities: IEntityConfig[]
  selectSwitch: string | null
}

interface EntitesFormProps {
  entities: IEntityConfig[]
  states: IState[]
  onSave: (entities: IEntityConfig[]) => void
}

export default function EntitiesForm(props: EntitesFormProps) {
  const { entities, onSave, states } = props;
  const { t } = useTranslation('SETTINGS');

  const formDefaultValues: TFormValues = {
    entities,
    selectSwitch: null,
  };

  const filteredStates = states.filter((e) => e.entity_id.startsWith('switch.'));

  return (
    <FormContainer<TFormValues>
      defaultValues={formDefaultValues}
      onSuccess={async (values) => {
        onSave(values.entities);
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <ManageSwitches states={filteredStates} />
        </Grid>

        <Grid xs={12}>
          <SubmitButton>
            {t('SAVE_SWITCHES')}
          </SubmitButton>
        </Grid>
      </Grid>

    </FormContainer>
  );
}
