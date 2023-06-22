import React from 'react';
import isEqual from 'react-fast-compare';
import { FieldPath, FieldPathValues, useWatch } from 'react-hook-form-mui';
import { usePrevious } from 'react-use';

import { genericMemo } from '../../utils/genericMemo';

export interface FormOnFieldChangeProps<
    FormValues,
    TFieldNames extends readonly FieldPath<FormValues>[] = readonly FieldPath<FormValues>[],
> {
  fields: readonly [...TFieldNames];
  onChange: (values: FieldPathValues<FormValues, TFieldNames>) => void;
}

function FormOnFieldChange<FormValues>({ onChange, fields }: FormOnFieldChangeProps<FormValues>): null {
  const didMount = React.useRef(false);

  // watch cannot be used here. exact: false is needed here
  const watchFields = useWatch({ name: fields });

  // the poor mans deep copy
  const prevFields = usePrevious(structuredClone(watchFields));

  React.useEffect(() => {
    if (didMount.current) {
      let valuesChanged = false;

      fields.forEach((_fieldName, index) => {
        const newValue = watchFields[index];
        // console.log("check", _fieldName, newValue, prevFields ? prevFields[index] : undefined);
        if (prevFields && !isEqual(prevFields[index], newValue)) {
          valuesChanged = true;
        }
      });

      if (valuesChanged) {
        onChange(watchFields);
      }
    } else didMount.current = true;
  }, [fields, watchFields, onChange, prevFields]);

  return null;
}

export default genericMemo(FormOnFieldChange);
