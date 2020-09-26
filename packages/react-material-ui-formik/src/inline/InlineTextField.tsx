import { useField, useFormikContext } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import {
  Grid,
  GridProps,
  InputAdornment,
  InputProps,
  TextField,
  Typography,
  CircularProgress,
  // ButtonGroup,
  // Button,
  ClickAwayListener,
  ButtonGroup,
  Button
} from '@material-ui/core';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  .select-field {
    margin-right: 22px;
  }
  .MuiInputBase-multiline {
    align-items: flex-end;
  }
  .multiline {
    margin-bottom: 10px;
  }
`;

export type InlineTextFieldProps = {
  name: string;
  label?: string;
  type?: string;
  value?: string | number;
  disabled?: boolean;
  multiline?: boolean;
  select?: boolean;
  placeholder?: string;
  grid?: GridProps;
  inputProps?: InputProps;
  variant?: 'standard' | 'filled' | 'outlined';
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const InlineTextField: React.FC<InlineTextFieldProps> = props => {
  let {
    children,
    multiline,
    select,
    label,
    name,
    type,
    value,
    placeholder,
    disabled,
    grid,
    inputProps,
    variant = 'outlined' as any,
    onChange
  } = props;
  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched }] = useField(props);
  const [focus, setFocus] = useState(false);
  const [lastSubmitCount, setLastSubmitCount] = useState(formik.submitCount);
  const [previousValue, setPreviousValue] = useState(meta.initialValue);
  const cancelButtonRef = useRef<HTMLButtonElement>();

  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }

  useEffect(() => {
    // update previous value if initial value changes
    setPreviousValue(meta.initialValue);
  }, [meta.initialValue]);

  useEffect(() => {
    if (!formik.isSubmitting && lastSubmitCount !== formik.submitCount) {
      // form finished submitting so set current value to previous value
      setPreviousValue(meta.value);
      setLastSubmitCount(formik.submitCount);
    }
  }, [formik.isSubmitting, formik.submitCount, lastSubmitCount, meta.value]);

  const handleSubmit = () => {
    console.log('handleSubmit');
    setTouched(true);
    setFocus(false);
    formik.submitForm();
  };
  const handleCancel = () => {
    setTouched(false);
    setValue(previousValue);
  };

  const getAdornmentClasses = () => {
    const classes = [];
    if (select) classes.push('select-field');
    if (multiline) classes.push('multiline');
    return classes.join(' ');
  };

  if (!meta.error && formik.isSubmitting && meta.value !== previousValue) {
    inputProps = {
      ...inputProps,
      endAdornment: (
        <InputAdornment position='end' className={getAdornmentClasses()}>
          <CircularProgress color='primary' size={25} />
        </InputAdornment>
      )
    };
  } else if (focus) {
    inputProps = {
      ...inputProps,
      endAdornment: (
        <InputAdornment position='end' className={getAdornmentClasses()}>
          <ButtonGroup color='primary' variant='text'>
            <Button size='small' tabIndex={-1} onClick={handleSubmit}>
              <DoneIcon />
            </Button>
            <Button
              size='small'
              tabIndex={-1}
              innerRef={cancelButtonRef}
              onClick={event => {
                event.stopPropagation();
                handleCancel();
              }}
            >
              <ClearIcon />
            </Button>
          </ButtonGroup>
        </InputAdornment>
      )
    };
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        // console.log('onClickAway');
        // handleSubmit();
      }}
    >
      <StyledGrid item className='inline-text-field' {...grid}>
        {label && (
          <Typography variant='h5' gutterBottom>
            {label}
          </Typography>
        )}
        <TextField
          variant={variant}
          type={type}
          // size='small'
          multiline={multiline}
          select={select}
          name={name}
          value={value || field.value}
          // label={label}
          placeholder={placeholder}
          disabled={disabled}
          // InputLabelProps={{ shrink: true }}
          autoComplete='off'
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.error}
          InputProps={inputProps}
          onFocus={() => setFocus(true)}
          onChange={event => {
            field.onChange(event);
            // if editing disabled touched until blur
            setTouched(false);
            onChange?.(event);
          }}
          onKeyDown={event => {
            // console.log('event.key', event.key);
            switch (event.key) {
              case 'Escape':
                return handleCancel();
              // case 'Tab':
              // case 'Enter':
              //   return handleSubmit();
            }
          }}
          onBlur={event => {
            if (event.relatedTarget === cancelButtonRef.current) {
              handleCancel();
            } else {
              handleSubmit();
            }
          }}
        >
          {children}
        </TextField>
      </StyledGrid>
    </ClickAwayListener>
  );
};

export default InlineTextField;
