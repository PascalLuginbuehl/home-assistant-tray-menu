import { Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useFormContext, useFormState, useWatch,
} from 'react-hook-form-mui';
import { useDebouncedCallback } from 'use-debounce';

interface AutoSaveProps<TFormValues extends FieldValues> {
  onSubmit: SubmitHandler<TFormValues>
}

// autosave from https://codesandbox.io/s/react-hook-form-auto-save-xgulp?file=/src/AutoSave.tsx:0-1682
export default function AutoSave<TFormValues extends FieldValues>(props: AutoSaveProps<TFormValues>) {
  const { onSubmit } = props;

  const { handleSubmit } = useFormContext<TFormValues>();
  const { isDirty, isSubmitting } = useFormState();

  const debouncedSave = useDebouncedCallback(
    () => {
      handleSubmit(onSubmit)();
    },
    500,
  );

  const watchedData = useWatch<TFormValues>();

  useEffect(() => {
    if (isDirty) {
      debouncedSave();
    }
  }, [watchedData, debouncedSave, isDirty]);

  return (
    <Box mt={2} height={20}>
      {isSubmitting && (
        <CircularProgress color="secondary" size={20} />
      )}
    </Box>
  );
}
