import React from 'react';

import { MenuItem } from '@material-ui/core';

import InlineTextField, { InlineTextFieldProps } from './InlineTextField';

export interface InlineSelectOptions {
  value: string | number;
  label: string;
}

export interface InlineSelectProps extends InlineTextFieldProps {
  options?: (InlineSelectOptions | string)[];
}

const InlineSelect: React.FC<InlineSelectProps> = props => {
  let { options, children } = props;

  return (
    <InlineTextField select {...props}>
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
  );
};

export default InlineSelect;
