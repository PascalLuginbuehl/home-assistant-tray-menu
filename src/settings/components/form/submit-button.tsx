import React, { ReactNode } from 'react';
import { Button } from '@mui/material';
import { useFormContext } from 'react-hook-form-mui';

export default function SubmitButton({ children }: { children: ReactNode }) {
  const { formState } = useFormContext();
  return (
    <Button type="submit" color="primary" variant="contained" disabled={formState.isSubmitting}>
      {children}
    </Button>
  );
}
