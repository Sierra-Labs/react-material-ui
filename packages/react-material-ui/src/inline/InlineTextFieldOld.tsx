import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  fieldset {
    border: 1px solid transparent;
  }
  &:hover fieldset.MuiOutlinedInput-notchedOutline {
    border: 1px solid #ccc;
  }
  &.touched fieldset.MuiOutlinedInput-notchedOutline {
    border: 1px solid ${props => props.theme.palette.primary.main};
  }
`;

type InlineTextFieldProps = TextFieldProps & {
  touched?: boolean;
};
const InlineTextFieldOld: React.FC<InlineTextFieldProps> = props => {
  const { touched } = props;

  const getClassName = () => {
    const classes = ['inline-text-field'];
    if (touched) classes.push('touched');
    return classes.join(' ');
  };
  const textFieldProps = { ...props };
  delete textFieldProps.touched;
  return (
    <StyledTextField
      size='small'
      {...textFieldProps}
      className={getClassName()}
    />
  );
};

export default InlineTextFieldOld;
