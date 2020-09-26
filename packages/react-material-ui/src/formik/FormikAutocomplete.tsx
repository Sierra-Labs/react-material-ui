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
import { useDebounce } from '../Debounce.hooks';

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

type FormikAutocompleteProps<T> = TextFieldProps & {
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
};

const FormikAutocomplete: React.FC<FormikAutocompleteProps<any>> = props => {
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
    grid
  } = props;
  // Create a ref that store the onSearch handler
  const searchHandler = useRef<(event: any) => void>();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  if (!getSelectedValue) {
    // default to return option object
    getSelectedValue = (option: any) => option;
  }
  useEffect(() => {
    searchHandler.current = onSearch;
  }, [onSearch]);
  const [field, meta, { setValue, setTouched }] = useField(name);
  const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(field.value);
  const [forceSearch, setForceSearch] = useState(false);
  const debouncedSearch = useDebounce(search ? search : '', 300);
  useEffect(() => {
    if ((forceSearch || debouncedSearch) && searchHandler.current) {
      searchHandler.current(debouncedSearch);
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
        options={options}
        loading={loading}
        onInputChange={(event, value, reason) => setSearch(value)}
        onBlur={field.onBlur}
        onChange={(event: React.ChangeEvent<{}>, value: any) => {
          console.log('onChange', value);
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
