import { useField, useFormikContext } from 'formik';
import React from 'react';

import {
  FormControl,
  FormControlLabel,
  FormControlTypeMap,
  FormHelperText,
  Grid,
  GridProps,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

export interface InlineRadioGroupOptions {
  value: string | number | boolean;
  label: string;
}

export interface InlineRadioGroupProps {
  name: string;
  label?: string;
  isBoolean?: boolean;
  disabled?: boolean;
  options: (InlineRadioGroupOptions | string)[];
  grid?: GridProps<OverridableComponent<FormControlTypeMap<{}, 'div'>>>;
}

const InlineRadioGroup: React.FC<InlineRadioGroupProps> = props => {
  const { label, name, isBoolean, disabled, options, grid } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue }] = useField(props);
  return (
    <Grid item {...grid}>
      {label && <Typography variant='h5'>{label}</Typography>}
      <FormControl
        name={name}
        error={meta.touched && Boolean(meta.error)}
        component='fieldset'
      >
        <RadioGroup
          row
          aria-label={label}
          {...field}
          name={name}
          onChange={event => {
            if (isBoolean) {
              setValue(event.target.value === 'true');
            } else {
              setValue(event.target.value);
            }
            formik.submitForm();
          }}
        >
          {options.map(option =>
            typeof option === 'string' ? (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio color='primary' />}
                label={option}
                disabled={disabled}
              />
            ) : (
              <FormControlLabel
                key={option.value.toString()}
                value={option.value}
                control={<Radio color='primary' />}
                label={option.label}
                disabled={disabled}
              />
            )
          )}
        </RadioGroup>
      </FormControl>
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </Grid>
  );
};

export default InlineRadioGroup;
