import { LampIcon } from '@fluentui/react-icons-mdl2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import React from 'react';

function serviceAction(domain: string, service: string, serviceData: unknown, apiURL: string, token: string) {
  return axios.post(
    `${apiURL}/api/services/${domain}/${service}`,
    serviceData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

async function fetchStates(apiURL: string, token: string) {
   const { data } = await axios.get<IState[]>(
    `${apiURL}/api/states`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return data
}
interface IState {
   "attributes": unknown
   "entity_id": string
   "last_changed": string
   "last_updated": string
   "state": string
}

const configuration = [{
    "label": "Bedroom Corner",
    "icon": "floor-lamp-outline@2x.png",
    "action": {
      "domain": "switch",
      "service": "toggle",
      "serviceData": {
        "entity_id": "switch.pascal_bedroom_corner_lamp"
      }
    }
  },
  {
    "label": "Bedroom",
    "icon": "ceiling-light@2x.png",
    "action": {
      "domain": "switch",
      "service": "toggle",
      "serviceData": {
        "entity_id": "switch.pascal_bedroom_light"
      }
    }
  },
  {
    "label": "3D Printer",
    "icon": "ceiling-light@2x.png",
    "action": {
      "domain": "switch",
      "service": "toggle",
      "serviceData": {
        "entity_id": "switch.corridor_led_strip"
      }
    }
  }
]


export function App() {
  const { data, refetch } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const states = await fetchStates()
      states.filter(state => configuration.map(e => e.action.serviceData.entity_id).includes(state.entity_id))
    },
    suspense: true
 })

  return (
    <div className='window-base'>
      <div className="titlebar">
        <h2 className="title">Hello from React!</h2>
      </div>

      {configuration.map(({label, action}) => (
        <button
          key={label}
          className={clsx("actionButton", data.find(d => action.serviceData.entity_id === d.entity_id).state === "on" && "selected")}
          onClick={async () => {
            await serviceAction(action.domain, action.service, action.serviceData)
            await refetch()
          }}
        >
          <LampIcon />
          {label}
        </button>
      ))}
    </div>
  )
}

