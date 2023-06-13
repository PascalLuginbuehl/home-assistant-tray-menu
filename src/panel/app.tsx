import axios from 'axios';
import React from 'react';

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

export function App() {

  return (
    <div>
      <h2>Hello from React!</h2>
      <button onClick={serviceAction}>Toggle</button>
    </div>
  )
}

