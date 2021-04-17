import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';

import {
  Checkbox,
  CheckboxProps,
  Grid,
  GridProps,
  FormControlLabel
} from '@material-ui/core';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export type FormikCheckboxFieldProps = Omit<CheckboxProps, 'name'> & {
  name: string;
  label?: string;
  grid?: GridProps;
};

export const FormikCheckboxField: React.FC<FormikCheckboxFieldProps> = ({
  name,
  label,
  grid,
  color = 'primary',
  ...checkboxProps
}) => {
  const [field] = useField(name);
  return (
    <StyledGrid item className='formik-text-field' {...grid}>
      <FormControlLabel
        control={
          <Checkbox
            color={color}
            {...field}
            checked={field.value}
            {...checkboxProps}
          />
        }
        label={label}
      />
    </StyledGrid>
  );
};

export default FormikCheckboxField;
