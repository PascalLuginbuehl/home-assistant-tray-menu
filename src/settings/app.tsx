import React from 'react';
import {
  Box,
} from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Connection from './routes/connection/connection';
import EntitiesForm from './entities-form';
import useSettings from '../utils/use-settings';

export default function App() {
  const { settings, saveSettings } = useSettings();

  if (!settings) {
    return 'Loading settings';
  }

  return (
    <Box p={1}>
      <Routes>
        <Route
          path="/connection"
          element={(
            <Connection
              settings={settings}
              onSaveSettings={async (newSettings) => {
                await saveSettings(newSettings);
              }}
            />
            )}
        />
        <Route path="/" element={<EntitiesForm entities={settings.entities} onSave={(entities) => saveSettings({ entities })} />} />
      </Routes>
    </Box>
  );
}
