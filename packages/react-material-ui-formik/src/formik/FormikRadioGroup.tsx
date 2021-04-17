import { useField } from 'formik';
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

export interface FormikRadioGroupOptions {
  value: string | number | boolean;
  label: string;
}

export const FormikRadioGroup: React.FC<{
  name: string;
  label?: string;
  isBoolean?: boolean;
  options: (FormikRadioGroupOptions | string)[];
  grid?: GridProps<OverridableComponent<FormControlTypeMap<{}, 'div'>>>;
  onChange?: (value: string | number | boolean) => void;
}> = props => {
  const { label, name, isBoolean, options, grid, onChange } = props;
  const [field, meta, { setValue }] = useField(name);
  return (
    <Grid item {...grid}>
      {label && <Typography variant='body2'>{label}</Typography>}
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
              onChange?.(event.target.value === 'true');
            } else {
              setValue(event.target.value);
              onChange?.(event.target.value);
            }
          }}
        >
          {options.map(option =>
            typeof option === 'string' ? (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio color='primary' />}
                label={option}
              />
            ) : (
              <FormControlLabel
                key={option.value.toString()}
                value={option.value}
                control={<Radio color='primary' />}
                label={option.label}
              />
            )
          )}
        </RadioGroup>
      </FormControl>
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </Grid>
  );
};

export default FormikRadioGroup;
