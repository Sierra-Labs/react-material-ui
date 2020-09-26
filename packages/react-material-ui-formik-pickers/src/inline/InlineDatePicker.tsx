import { useField, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Grid, GridProps, Typography } from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

const InlineDatePicker: React.FC<{
  name: string;
  label: string;
  disabled?: boolean;
  format?: string;
  placeholder?: string;
  grid?: GridProps;
  birthdate?: boolean;
  picker?: KeyboardDatePickerProps;
}> = props => {
  let {
    label,
    name,
    format,
    placeholder,
    birthdate,
    picker,
    grid,
    disabled
  } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue, setError, setTouched }] = useField(props);
  const [lastSubmitCount, setLastSubmitCount] = useState(formik.submitCount);
  const [previousValue, setPreviousValue] = useState(meta.initialValue);
  const eventRef = useRef<React.ChangeEvent<any>>();

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  const datePickerProps: Partial<KeyboardDatePickerProps> = { ...picker };
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
  const value = !isNaN(new Date(field.value).getTime()) ? field.value : null;

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
    console.log('handleChange', date);
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
      <Typography variant='h5' gutterBottom>
        {label}
      </Typography>
      <KeyboardDatePicker
        // autoOk
        name={name}
        disabled={disabled}
        variant='inline'
        inputVariant='outlined'
        placeholder={placeholder}
        format={format || 'MM/dd/yyyy'}
        InputAdornmentProps={{ position: 'end' }}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.error}
        value={value}
        onChange={(date, value) => handleChange(date)}
        onAccept={date => {
          // save when selecting from popup dialog
          handleChange(date);
          formik.submitForm();
        }}
        onError={error => {
          if (error !== meta.error) {
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
          // save on field blur
          setTouched(true);
          formik.submitForm();
        }}
        {...datePickerProps}
      />
    </StyledGrid>
  );
};

export default InlineDatePicker;
