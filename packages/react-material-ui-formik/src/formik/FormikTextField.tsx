import { useField } from 'formik';
import React from 'react';
import styled from 'styled-components';
import {
  Grid,
  GridProps,
  TextField,
  TextFieldProps,
  IconButton
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  .select-field {
    margin-right: 22px;
  }
`;

export type FormikTextFieldProps = TextFieldProps & {
  name: string;
  grid?: GridProps;
};

export const FormikTextField: React.FC<FormikTextFieldProps> = props => {
  let { variant, type } = props;
  let { name, grid, helperText, ...textFieldProps } = props;
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = React.useState(false);

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <StyledGrid item className='formik-text-field' {...grid}>
      <TextField
        {...textFieldProps}
        variant={variant || ('outlined' as any)}
        autoComplete='off'
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.error || helperText}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        InputProps={{
          endAdornment: (
            <React.Fragment>
              {type === 'password' ? (
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ) : null}
            </React.Fragment>
          )
        }}
        {...field}
        name={name}
      />
    </StyledGrid>
  );
};

export default FormikTextField;
