import axios from 'axios';
import React, { useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ISettings } from '../store';
import ManageSwitches from './manage-switches';

async function checkApiUrl(apiURL: string, token: string) {
  const { data } = await axios.get(`${apiURL}/api/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  return data
}

export interface TFormValues extends ISettings {
  selectSwitch: string | null
}

export function Entities() {
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  return (
    <div>
      <FormContainer<TFormValues>
        defaultValues={window.electronAPI.store.getSettings()}
        onSuccess={async (values) => {
            window.electronAPI.store.setSettings(values)
            try {
              await checkApiUrl(values.hassApiUrl, values.longLivedAccessToken)
              setApiUrl(values.hassApiUrl)
              setToken(values.longLivedAccessToken)
            } catch(e) {
              console.log(e)
            }

            console.log(values)
            return
          }}
      >
        <Grid container spacing={1}>
          <Grid xs={12}>
            <TextFieldElement<TFormValues> name="hassApiUrl" label="HASS URL" placeholder='http://192.168.1.x:8123' fullWidth/>
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
        <ManageSwitches apiUrl={apiUrl} token={token} />
      </FormContainer>
    </div>
  )
}

