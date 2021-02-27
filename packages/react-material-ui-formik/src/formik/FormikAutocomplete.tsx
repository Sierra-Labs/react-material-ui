import { useField } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  Grid,
  GridProps,
  TextField,
  TextFieldProps,
  CircularProgress
} from '@material-ui/core';
import { useDebounce } from '@sierralabs/react-material-ui';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  .select-field {
    margin-right: 22px;
  }
  .MuiAutocomplete-root {
    display: flex;
    flex-direction: column;
  }
`;

export type FormikAutocompleteProps<T> = TextFieldProps & {
  name: string;
  grid?: GridProps;
  loading?: boolean;
  // Callback fired when searching (debounced)
  onSearch?: (value: string) => void;
  // Callback fired when the value changes.
  onChange?: (value: T) => void;
  /**
   * Array of options.
   */
  options: T[];
  /**
   * Used to determine the disabled state for a given option.
   */
  getOptionDisabled?: (option: T) => boolean;
  /**
   * Used to determine the string value for a given option.
   * It's used to fill the input (and the list box options if `renderOption` is not provided).
   */
  getOptionLabel?: (option: T) => string;
  /**
   * Used to determine if an option is selected.
   * Uses strict equality by default.
   */
  getOptionSelected?: (option: T, value: T) => boolean;
  /**
   * Used to override the selected value
   */
  getSelectedValue?: (option: T) => any;
  /**
   * A filter function that determines the options that are eligible.
   */
  filterOptions?: (options: T[], state: { inputValue: string }) => T[];
};

export const FormikAutocomplete: React.FC<FormikAutocompleteProps<
  any
>> = props => {
  let {
    onSearch,
    onChange,
    options,
    loading,
    name,
    label,
    getOptionDisabled,
    getOptionSelected,
    getOptionLabel,
    getSelectedValue,
    filterOptions,
    grid
  } = props;
  // Create a ref that store the onSearch handler
  const onSearchRef = useRef(onSearch);
  const mountedRef = useRef(false);
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  if (!getSelectedValue) {
    // default to return option object
    getSelectedValue = (option: any) => option;
  }
  const [field, meta, { setValue, setTouched }] = useField(name);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(field.value);
  const [forceSearch, setForceSearch] = useState(false);
  const debouncedSearch = useDebounce(search ? search : '', 300);
  useEffect(() => {
    // mountedRef so that we don't onSearch on mount
    if (forceSearch || mountedRef.current) {
      onSearchRef.current?.(debouncedSearch);
      setForceSearch(false);
    } else {
      mountedRef.current = true;
    }
  }, [debouncedSearch, forceSearch]);

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  return (
    <StyledGrid item className='formik-autocomplete' {...grid}>
      <Autocomplete
        open={open}
        // debug
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionDisabled={getOptionDisabled}
        getOptionSelected={getOptionSelected}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions}
        options={options}
        loading={loading}
        onInputChange={(event, value, reason) => {
          console.log('onInputChange', value);
          setSearch(value);
        }}
        onBlur={field.onBlur}
        onChange={(event: React.ChangeEvent<{}>, value: any) => {
          if (onChange) {
            onChange(value);
          }
          if (getSelectedValue && value) {
            setValue(getSelectedValue(value));
            // field.onChange(event);
          }
          setTouched(true);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            variant='outlined'
            autoComplete='new-password'
            InputProps={{
              ...params.InputProps,
              autoComplete: 'new-password', // disable browser autcomplete
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.error}
            onKeyPress={(event: any) =>
              event.key === 'Enter' && setForceSearch(true)
            }
          />
        )}
      />
    </StyledGrid>
  );
};

export default FormikAutocomplete;
