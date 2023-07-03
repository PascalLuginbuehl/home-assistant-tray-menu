import React from 'react';
import {
  Box,
} from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Connection from './routes/connection/connection';
import EntitiesForm from './entities-form';

export default function App() {
  return (
    <Box p={2}>
      <Routes>
        <Route
          path="/connection"
          element={<Connection />}
        />
        <Route
          path="/"
          element={<EntitiesForm />}
        />
      </Routes>
    </Box>
  );
}
