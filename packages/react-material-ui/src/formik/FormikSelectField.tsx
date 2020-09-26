import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';

import {
  Grid,
  GridProps,
  MenuItem,
  TextField,
  TextFieldProps
} from '@material-ui/core';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  .select-field {
    margin-right: 22px;
  }
`;

export interface FormikSelectOptions {
  value: string | number;
  label: string;
}

export type FormikSelectFieldProps = TextFieldProps & {
  name: string;
  grid?: GridProps;
  options?: (FormikSelectOptions | string)[];
};

const FormikSelectField: React.FC<FormikSelectFieldProps> = props => {
  let { variant, name, children, grid, options } = props;
  const [field, meta] = useField(name);

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }

  return (
    <StyledGrid item className='formik-select-field' {...grid}>
      <TextField
        select
        variant={variant || ('outlined' as any)}
        autoComplete='off'
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.error}
        {...props}
        {...field}
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
