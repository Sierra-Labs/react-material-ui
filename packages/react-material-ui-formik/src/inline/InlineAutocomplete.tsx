import { useField, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';

import FormikAutocomplete, {
  FormikAutocompleteProps
} from '../formik/FormikAutocomplete';

export type InlineAutocompleteProps<T> = FormikAutocompleteProps<T> & {};

export const InlineAutocomplete: React.FC<InlineAutocompleteProps<any>> = ({
  name,
  ...props
}) => {
  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched, setError }] = useField(name);
  const [previousValue, setPreviousValue] = useState(meta.initialValue);
  const [lastSubmitCount, setLastSubmitCount] = useState(formik.submitCount);
  useEffect(() => {
    // update previous value if initial value changes
    setPreviousValue(meta.initialValue);
  }, [meta.initialValue]);
  useEffect(() => {
    if (!formik.isSubmitting && lastSubmitCount !== formik.submitCount) {
      // form finished submitting so set current value to previous value
      setPreviousValue(meta.value);
      setLastSubmitCount(formik.submitCount);
    }
  }, [formik.isSubmitting, formik.submitCount, lastSubmitCount, meta.value]);

  return (
    <FormikAutocomplete
      name={name}
      {...props}
      onKeyDown={event => {
        // console.log('event.key', event.key);
        switch (event.key) {
          case 'Escape':
            setTouched(false);
            setValue(previousValue);
            break;
          // case 'Tab':
          // case 'Enter':
          //   return handleSubmit();
        }
      }}
      onBlur={event => {
        setTouched(true);
        formik.submitForm();
      }}
    />
  );
};

export default InlineAutocomplete;
