import {
  GridProps,
  FormControlTypeMap,
  Switch,
  FormControlLabel,
  FormControl,
  Grid,
  FormHelperText
} from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { useField } from 'formik';
import React, { useMemo } from 'react';

export interface FormikSwitchProps {
  name: string;
  label?: string;
  grid?: GridProps<OverridableComponent<FormControlTypeMap<{}, 'div'>>>;
}

export const FormikSwitch: React.FC<FormikSwitchProps> = props => {
  let { label, name, grid } = props;
  const [field, meta, { setValue }] = useField(props);
  if (!grid) {
    // default field  to expand entire width of the form
    grid = { xs: 12 };
  }

  return useMemo(
    () => (
      <Grid item {...grid}>
        {/* {label && <Typography variant='h6'>{label}</Typography>} */}
        <FormControl
          name={name}
          error={meta.touched && Boolean(meta.error)}
          component='fieldset'
        >
          <FormControlLabel
            control={
              <Switch
                aria-label={label}
                {...field}
                name={name}
                color='primary'
                onChange={event => {
                  setValue(event.target.checked);
                }}
              />
            }
            value={meta.value}
            checked={meta.value}
            label={label}
            labelPlacement='end'
          />
        </FormControl>
        {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
      </Grid>
    ),
    [field.value, meta.error, name, label]
  );
};

export default FormikSwitch;
