import React, { useMemo } from 'react';

import { MenuItem } from '@material-ui/core';

import InlineTextField, { InlineTextFieldProps } from './InlineTextField';
import { useField, useFormikContext } from 'formik';

export interface InlineSelectFieldOptions {
  value: string | number;
  label: string;
}

export interface InlineSelectFieldProps extends InlineTextFieldProps {
  options?: (InlineSelectFieldOptions | string)[];
}

export const InlineSelectField: React.FC<InlineSelectFieldProps> = props => {
  let { name, options, children } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched }] = useField(name);
  return useMemo(
    () => (
      <InlineTextField
        select
        disableFocusControls
        {...props}
        onChange={event => {
          setTouched(true);
          field.onChange(event);
          formik.submitForm();
        }}
      >
        {options &&
          options.map(option =>
            typeof option === 'string' ? (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ) : (
              <MenuItem key={option.value.toString()} value={option.value}>
                {option.label}
              </MenuItem>
            )
          )}
        {children}
      </InlineTextField>
    ),
    [children, field, formik, options, props, setTouched]
  );
};

export default InlineSelectField;
