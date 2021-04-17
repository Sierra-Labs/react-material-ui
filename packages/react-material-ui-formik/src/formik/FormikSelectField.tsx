import { useField, useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';

import {
  Grid,
  GridProps,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export interface FormikSelectOptions {
  value: string;
  label: string;
}

type FormikSelectFieldProps = TextFieldProps & {
  name: string;
  grid?: GridProps;
  submitOnChange?: boolean;
  clearable?: boolean | number | string;
  options?: (FormikSelectOptions | string)[];
};

export const FormikSelectField: React.FC<FormikSelectFieldProps> = props => {
  let {
    variant,
    name,
    children,
    grid,
    submitOnChange,
    clearable,
    options,
    ...childProps
  } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched }] = useField(name);

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  if (submitOnChange) {
    childProps.onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(event);
      setTouched(true);
      formik.submitForm();
    };
  }
  const InputProps = childProps.InputProps || {};
  const resetValue = typeof clearable === 'boolean' ? '' : clearable;
  if (clearable && field.value) {
    InputProps.endAdornment = (
      <InputAdornment position='end' className='select-field-adornment'>
        <IconButton
          size='small'
          onClick={() => {
            setTouched(true);
            setValue(resetValue);
            if (submitOnChange) {
              formik.submitForm();
            }
          }}
        >
          <ClearIcon />
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <StyledGrid item className='formik-select-field' {...grid}>
      <TextField
        select
        variant={variant || ('outlined' as any)}
        autoComplete='off'
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.error}
        {...field}
        {...childProps}
        InputProps={InputProps}
        name={name}
      >
        {options &&
          options.map(option =>
            typeof option === 'string' ? (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ) : (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            )
          )}
        {children}
      </TextField>
    </StyledGrid>
  );
};

export default FormikSelectField;
