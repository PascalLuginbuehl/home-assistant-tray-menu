import axios from 'axios';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import FormGroupList from './form/FormGroupList';
import type { TFormValues } from './app';

async function fetchStates(apiUrl: string, token: string) {
  const { data } = await axios.get<IState[]>(
    `${apiUrl}/api/states`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return data;
}

export interface IState {
  entity_id: string
  state: string
  attributes: {
    friendly_name: string
  }
  last_changed: string
  last_updated: string
  context: {
    id: string
    parent_id: string | null
    user_id: string
  }
}

interface ManageSwitchesProps {
  apiUrl: string | null,
  token: string | null,
}

export default function ManageSwitches(props: ManageSwitchesProps) {
  const { apiUrl, token } = props;

  const { handleSubmit } = useFormContext<TFormValues>();

  const {
    data, isSuccess, isError, refetch,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => {
      // console.log(apiUrl, token);

      if (!apiUrl || !token) {
        return Promise.reject(new Error('No tokens given'));
      }

      return fetchStates(apiUrl, token);
    },
    retry: false,
    // suspense: true
  });

  useEffect(() => {
    refetch();
  }, [apiUrl, token, refetch]);

  if (!isSuccess || isError) {
    return (
      <Typography>Could not fetch</Typography>
    );
  }

  const filteredData = data.filter((e) => e.entity_id.startsWith('switch.'));
  const options = filteredData.map((e) => ({ id: e.entity_id, label: e.attributes.friendly_name }));

  return (
    <Grid container>
      <Grid xs={12}>
        <Typography>Available Switches</Typography>
      </Grid>

      <Grid xs={12}>
        <FormGroupList<TFormValues, { id: string, label: string } >
          name="entityIds"
          selectFieldName="selectSwitch"
          optionValueField="id"
          options={options}
          renderOption={(option) => (
            <ListItemText
              primary={option.label}
            />
          )}
          renderSelectField={(filteredOptions) => (
            <AutocompleteElement name="selectSwitch" options={filteredOptions} textFieldProps={{ fullWidth: true }} matchId autocompleteProps={{ fullWidth: true }} />
          )}
          enableAutoSave
          saveAction={handleSubmit((values) => {
            window.electronAPI.store.setSettings(values);
          })}
        />
      </Grid>
    </Grid>
  );
}
