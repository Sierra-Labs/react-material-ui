import { useField } from 'formik';
import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import styled from 'styled-components';

import { Grid, TextField } from '@material-ui/core';

import { FormikTextFieldProps } from './FormikTextField';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export type FormikNumberFieldProps = Omit<
  FormikTextFieldProps,
  'multiline' | 'multiple' | 'ref'
> &
  NumberFormatProps & {
    currency?: boolean;
    phoneNumber?: boolean;
    creditcard?: boolean;
    length?: number;
    min?: number;
    max?: number;
  };

export const FormikNumberField: React.FC<FormikNumberFieldProps> = ({
  name,
  type = 'tel', // force number input on mobile
  prefix,
  format,
  phoneNumber,
  creditcard,
  length,
  min,
  max,
  isNumericString,
  thousandSeparator,
  currency,
  grid = { xs: 12 },
  helperText,
  variant = 'outlined',
  ...props
}) => {
  const [field, meta, { setValue, setTouched }] = useField(name);
  if (creditcard) {
    format = '#### #### #### ####';
  } else if (phoneNumber) {
    format = '+1 (###) ###-####';
    // } else if (forceLeadingZero && length) {
    //   format = value =>
    //     value.length < length
    //       ? [...Array(length - value.length + 1)].join('0') + value
    //       : value;
  } else if (currency) {
    // TODO: implement props to customize as well as context to theme globally
    prefix = '$';
    thousandSeparator = true;
  } else if (!format && length) {
    format = [...Array(length + 1)].join('#');
    if (prefix) format = prefix + format;
  }
  return (
    <StyledGrid item className='formik-text-field' {...grid}>
      <NumberFormat
        {...props}
        type={type}
        prefix={prefix}
        variant={variant}
        format={format}
        min={min}
        max={max}
        value={field.value}
        thousandSeparator={thousandSeparator}
        isNumericString={isNumericString}
        onValueChange={values => {
          // determine if we should return a number or a string
          let value: any = values.floatValue;
          if (typeof field?.value === 'number' || field?.value === null) {
            // must return a number otherwise `diff()` will break
            value =
              typeof values.floatValue === 'number' ? values.floatValue : null;
          } else {
            value = values.value || null;
          }
          if (isNumericString) {
            value =
              typeof value === 'number' || typeof value === 'string'
                ? value.toString()
                : '';
          }
          setValue(value);
          setTouched(true);
        }}
        customInput={TextField}
        error={Boolean(props.error) || (meta.touched && Boolean(meta.error))}
        helperText={meta.error || helperText}
        name={name}
      />
    </StyledGrid>
  );
};

export default FormikNumberField;
