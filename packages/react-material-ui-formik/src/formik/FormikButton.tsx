import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@material-ui/core';
import { useFormikContext } from 'formik';

const FormikButton: React.FC<ButtonProps> = props => {
  const { variant, color, children } = props;
  const { dirty, isValid, isSubmitting } = useFormikContext();
  return (
    <Button
      type='submit'
      variant={variant || ('contained' as any)}
      color={color || 'primary'}
      disabled={!dirty || !isValid || isSubmitting}
      endIcon={isSubmitting && <CircularProgress color='primary' size={20} />}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormikButton;
