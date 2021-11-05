import { useField, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Grid, GridProps } from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export const FormikDatePicker: React.FC<
  Omit<KeyboardDatePickerProps, 'onChange' | 'value'> & {
    name: string;
    label: string;
    format?: string;
    placeholder?: string;
    grid?: GridProps;
    birthdate?: boolean;
    dateOnly?: boolean;
    value?: Date | null;
  }
> = ({
  label,
  name,
  variant = 'inline',
  inputVariant = 'outlined',
  format = 'MM/dd/yyyy',
  placeholder,
  birthdate,
  dateOnly,
  grid,
  value,
  ...datePickerProps
}) => {
  const formik = useFormikContext();
  const [field, meta, { setValue, setError, setTouched }] = useField(name);
  const [lastSubmitCount, setLastSubmitCount] = useState(formik.submitCount);
  const [previousValue, setPreviousValue] = useState(meta.initialValue);
  const eventRef = useRef<React.ChangeEvent<any>>();

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  if (birthdate) {
    datePickerProps.disableFuture = true;
    datePickerProps.openTo = 'year';
    datePickerProps.views = ['year', 'month', 'date'];
  }

  // fix date input format
  if (
    field.value &&
    typeof field.value === 'string' &&
    field.value.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    // fix date only fields (otherwise date offset by 1)
    field.value = `${field.value}T00:00:00`;
  }
  // important: value cannot be empty string
  value = value || !isNaN(new Date(field.value).getTime()) ? field.value : null;

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

  const handleCancel = () => {
    setTouched(false);
    setValue(previousValue);
  };

  const handleChange = (date: MaterialUiPickersDate) => {
    if (date && !isNaN(date.getTime())) {
      setTouched(true);
      // save date in ISO string format
      setValue(date.toISOString());
      if (eventRef.current) {
        // tell formik the field changed
        eventRef.current.target.value = date.toISOString();
        field.onChange(eventRef.current);
      }
    } else if (date === null) {
      setTouched(true);
      setValue(date);
      if (eventRef.current) {
        // tell formik the field changed
        eventRef.current.target.value = date;
        field.onChange(eventRef.current);
      }
    }
  };
  return (
    <StyledGrid item className='inline-text-field' {...grid}>
      <KeyboardDatePicker
        // autoOk
        inputVariant={inputVariant}
        InputAdornmentProps={{ position: 'end' }}
        format={format || 'MM/dd/yyyy'}
        label={label}
        placeholder={placeholder}
        error={
          Boolean(datePickerProps.error) ||
          (meta.touched && Boolean(meta.error))
        }
        helperText={meta.error || datePickerProps.helperText}
        variant={variant}
        value={value}
        onChange={(date, value) => handleChange(date)}
        onAccept={date => {
          handleChange(date);
        }}
        onError={error => {
          // only bubble KeyboardDatePicker error if no formik yup error
          if (error && !meta.error) {
            setError(error);
          }
        }}
        onKeyDown={event => {
          switch (event.key) {
            case 'Escape':
              return handleCancel();
          }
        }}
        onFocus={event => {
          // persist event to use for field.onChange()
          event.persist();
          eventRef.current = event;
        }}
        onBlur={event => {
          setTouched(true);
        }}
        {...datePickerProps}
      />
    </StyledGrid>
  );
};

export default FormikDatePicker;
