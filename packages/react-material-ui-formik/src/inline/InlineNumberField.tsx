import { useField } from 'formik';
import React, { useMemo } from 'react';
import NumberFormat from 'react-number-format';

import InlineTextField, { InlineTextFieldProps } from './InlineTextField';
import { InputProps } from '@material-ui/core';

type FormatFunction = (value: number | string) => string;

export interface FormikNumberFieldRenderOptions {
  prefix?: string;
  suffix?: string;
  format?: string | FormatFunction;
  isString?: boolean;
  currency?: boolean;
  phoneNumber?: boolean;
  creditcard?: boolean;
  allowLeadingZero?: boolean;
  thousandSeparator?: boolean;
  mask?: string;
  length?: number;
  min?: number;
  max?: number;
  InputProps?: InputProps;
}

export const renderNumberFormatter: (
  options: FormikNumberFieldRenderOptions
) => React.FC<{
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}> = ({
  format,
  isString,
  phoneNumber,
  creditcard,
  currency,
  allowLeadingZero,
  mask,
  length,
  prefix,
  suffix,
  thousandSeparator,
  ...numberFormatProps
}) => {
  if (creditcard) {
    format = '#### #### #### ####';
  } else if (phoneNumber) {
    // TODO: implement props to customize as well as context to theme globally
    format = '+1 (###) ###-####';
    isString = true;
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
  }
  return ({ inputRef, onChange, name, ...fieldProps }) => {
    const [field, meta, { setValue, setTouched }] = useField({ name });
    return (
      <NumberFormat
        {...numberFormatProps}
        {...fieldProps}
        name={name}
        format={format}
        prefix={prefix}
        suffix={suffix}
        thousandSeparator={thousandSeparator}
        allowLeadingZeros={allowLeadingZero}
        mask={mask}
        getInputRef={inputRef}
        onValueChange={values => {
          let value =
            (typeof field?.value === 'number' || field?.value === null) &&
            values.floatValue !== undefined
              ? values.floatValue
              : values.value
              ? values.value
              : null;
          if (isString) {
            value = `${value}`;
          }
          setValue(value);
          console.log(' field name', name);
          onChange({
            target: { name, value: value as any }
          });
        }}
      />
    );
  };
};

export type InlineNumberFieldProps = InlineTextFieldProps &
  FormikNumberFieldRenderOptions;

export const InlineNumberField: React.FC<InlineNumberFieldProps> = ({
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
  InputProps,
  thousandSeparator,
  currency,
  ...textFieldProps
}) => {
  return useMemo(
    () => (
      <InlineTextField
        type={type}
        inputProps={{
          ...InputProps,
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
            max,
            thousandSeparator,
            currency
          }) as any
        }}
        {...textFieldProps}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, textFieldProps.value, textFieldProps.disabled]
  );
};

export default InlineNumberField;
