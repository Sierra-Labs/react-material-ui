import { useField } from 'formik';
import React from 'react';
import NumberFormat from 'react-number-format';

import FormikTextField, { FormikTextFieldProps } from './FormikTextField';

type FormatFunction = (value: string) => string;

export interface FormikNumberFieldRenderOptions {
  prefix?: string;
  suffix?: string;
  format?: string | FormatFunction;
  phoneNumber?: boolean;
  creditcard?: boolean;
  allowLeadingZero?: boolean;
  mask?: string;
  length?: number;
  min?: number;
  max?: number;
}

const renderNumberFormatter: (
  options: FormikNumberFieldRenderOptions
) => React.FC<{
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}> = ({
  format,
  phoneNumber,
  creditcard,
  allowLeadingZero,
  length,
  min,
  max,
  ...numberFormatProps
}) => {
  if (creditcard) {
    format = '#### #### #### ####';
  } else if (phoneNumber) {
    format = '+1 (###) ###-####';
    // } else if (forceLeadingZero && length) {
    //   format = value =>
    //     value.length < length
    //       ? [...Array(length - value.length + 1)].join('0') + value
    //       : value;
  } else if (!format && length) {
    format = [...Array(length + 1)].join('#');
  }
  return ({ inputRef, onChange, name, ...fieldProps }) => {
    return (
      <NumberFormat
        {...numberFormatProps}
        {...fieldProps}
        name={name}
        format={format}
        allowLeadingZeros={allowLeadingZero}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: { name, value: values.value }
          });
        }}
      />
    );
  };
};

export type FormikNumberFieldProps = FormikTextFieldProps &
  FormikNumberFieldRenderOptions;

export const FormikNumberField: React.FC<FormikNumberFieldProps> = ({
  type = 'tel', // force number input on mobile
  prefix,
  suffix,
  format,
  phoneNumber,
  creditcard,
  allowLeadingZero,
  mask,
  length,
  min,
  max,
  ...textFieldProps
}) => {
  return (
    <FormikTextField
      type={type}
      InputProps={{
        inputComponent: renderNumberFormatter({
          prefix,
          suffix,
          format,
          phoneNumber,
          creditcard,
          allowLeadingZero,
          mask,
          length,
          min,
          max
        }) as any
      }}
      {...textFieldProps}
    />
  );
};

export default FormikNumberField;
