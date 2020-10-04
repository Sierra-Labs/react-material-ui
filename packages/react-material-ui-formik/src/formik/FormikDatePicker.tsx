import React from 'react';
import { Grid, GridProps } from '@material-ui/core';
import { useField } from 'formik';
import styled from 'styled-components';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps
} from '@material-ui/pickers';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export interface FormikDatePickerProps {
  name: string;
  label: string;
  placeholder?: string;
  grid?: GridProps;
  birthdate?: boolean;
  picker?: KeyboardDatePickerProps;
}

export const FormikDatePicker: React.FC<FormikDatePickerProps> = props => {
  let { label, name, placeholder, birthdate, picker, grid } = props;
  const [field, meta, { setValue, setError, setTouched }] = useField(props);
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
  return (
    <StyledGrid item className='inline-text-field' {...grid}>
      <KeyboardDatePicker
        // autoOk
        name={name}
        label={label}
        variant='inline'
        inputVariant='outlined'
        placeholder={placeholder}
        format='MM/dd/yyyy'
        InputAdornmentProps={{ position: 'end' }}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.error}
        value={field.value}
        onChange={(date, value) => {
          if (date) {
            const saveDate = !isNaN(date.getTime());
            setTouched(true);
            setValue(saveDate ? date : value);
          }
        }}
        onError={error => {
          if (error !== meta.error) {
            setError(error);
          }
        }}
        {...datePickerProps}
      />
    </StyledGrid>
  );
};

export default FormikDatePicker;
