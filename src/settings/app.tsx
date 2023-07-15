import React from 'react';
import {
  Box,
} from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Connection from './routes/connection/connection';
import Entities from './routes/entities/entities';
import Navigation from './navigation';
import Development from './routes/development/development';

export default function App() {
  return (
    <Box display="flex">
      <Navigation />
      <Box p={2} flex={1}>
        <Routes>
          <Route
            path="/connection"
            element={<Connection />}
          />
          <Route
            path="/development"
            element={<Development />}
          />
          <Route
            path="/"
            element={<Entities />}
          />

        </Routes>
      </Box>
    </Box>
  );
}
