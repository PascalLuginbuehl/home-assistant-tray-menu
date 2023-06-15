import axios from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query'
import { FormContainer, SelectElement } from 'react-hook-form-mui';
import { Button } from '@mui/material';

function serviceAction() {
  axios.post(
    "http://192.168.1.10:8123/api/services/switch/toggle", {
    "entity_id": "switch.pascal_bedroom_light"
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ***REMOVED***"
      }
    }
  )
}

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


export function Entities() {
  const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchStates, suspense: true })

  const filteredData = data.filter(e => e.entity_id.startsWith("switch."))

  return (
    <div>
      <h2>Hello from React!</h2>


      <FormContainer defaultValues={{select: null}} onSuccess={() => undefined}>
        <SelectElement name="select" options={filteredData.map(e => ({id: e.entity_id, label: e.attributes.friendly_name}))} />

         <Button type={'submit'} color={'primary'}>
          Submit
        </Button>
      </FormContainer>

      <button onClick={serviceAction}>Toggle</button>
    </div>
  )
}

