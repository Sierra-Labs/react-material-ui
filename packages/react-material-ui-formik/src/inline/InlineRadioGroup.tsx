import { useField, useFormikContext } from 'formik';
import React, { useMemo } from 'react';

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
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
  .error-label {
    color: ${props => props.theme.palette.error.main};
  }
`;

export interface InlineRadioGroupOptions {
  value: string | number | boolean;
  label: string;
}

export interface InlineRadioGroupProps {
  name: string;
  label?: string;
  isBoolean?: boolean;
  error?: string;
  options: (InlineRadioGroupOptions | string)[];
  grid?: GridProps<OverridableComponent<FormControlTypeMap<{}, 'div'>>>;
}

export const InlineRadioGroup: React.FC<InlineRadioGroupProps> = props => {
  let { label, name, isBoolean, error, options, grid } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue }] = useField(props);
  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  return useMemo(
    () => (
      <StyledGrid item {...grid}>
        {label && (
          <Typography
            variant='h5'
            className={error || meta.error ? 'error-label' : ''}
          >
            {label}
          </Typography>
        )}
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
        {(error || meta.error) && (
          <FormHelperText error>{error || meta.error}</FormHelperText>
        )}
      </StyledGrid>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field.value, meta.error, name, label, options]
  );
};

export default InlineRadioGroup;
