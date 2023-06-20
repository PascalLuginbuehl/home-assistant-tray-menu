import axios from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query'
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { Button, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import FormGroupList from './form/FormGroupList';
import { ISettings } from '../store';

async function fetchStates() {
   const { data } = await axios.get<IState[]>(
    "http://192.168.1.10:8123/api/states", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ***REMOVED***"
      }
    }
  )

  return data
}

export interface IState {
  entity_id: string
  state: string
  attributes: {
    friendly_name?: string
  }
  last_changed: Date
  last_updated: Date
  context: {
    id: string
    parent_id: string
    user_id: string
  }
}

interface TFormValues extends ISettings {
  selectedSwitches: string[]
  selectSwitch: string | null
}

export function Entities() {
  const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchStates, suspense: true })

  const filteredData = data.filter(e => e.entity_id.startsWith("switch."))
  const options = filteredData.map(e => ({id: e.entity_id, label: e.attributes.friendly_name}))

  const initialSelectedSwitches: string[] = []

  return (
    <div>
      <h2>Hello from React!</h2>

      <FormContainer<TFormValues> defaultValues={{selectedSwitches: initialSelectedSwitches, selectSwitch: null}} onSuccess={(values) => console.log(values)}>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <TextFieldElement<TFormValues> name="hassURL" label="HASS URL" placeholder='http://192.168.1.x:8123' fullWidth/>
          </Grid>
          <Grid xs={12}>
            <TextFieldElement<TFormValues> name="longLivedAccessToken" label="Long Lived Access Token" fullWidth />
          </Grid>

          <Grid xs={12}>
            <Button type={'submit'} color={'primary'} variant='contained'>
              Test connection
            </Button>
          </Grid>
        </Grid>

        <Grid container>
          <Grid xs={12}>
            <Typography>Available Switches</Typography>
          </Grid>

          <Grid xs={12}>
            <FormGroupList<TFormValues, {id: string, label: string} >
              name='selectedSwitches'
              selectFieldName='selectSwitch'
              optionValueField='id'
              options={options}
              renderOption={(option) => (
                <ListItemText
                    primary={option.label}
                />
              )}
              renderSelectField={(filteredOptions) => (
                <AutocompleteElement name="selectSwitch" options={filteredOptions} textFieldProps={{fullWidth: true}} matchId autocompleteProps={{fullWidth: true}}/>
              )}
            />
          </Grid>


        </Grid>

      </FormContainer>
    </div>
  )
}

