import { Formik, FormikConfig, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { CircularProgress, Typography } from '@material-ui/core';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import { FetchError } from '../api/api';
import { diff } from '../diff';

const StyledErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .error-title {
    margin: 10px 0 5px 0;
    color: ${props => props.theme.palette.error.main};
  }
  .error-body {
    margin-bottom: 10px;
  }
  code {
    font-size: 10px;
    color: #999;
  }
`;

export interface InlineFormikConfig<Values>
  extends Omit<FormikConfig<Values>, 'initialValues'> {
  initialValues?: Values; // make initialValues optional
}

type InlineFormikProps<Values, ExtraProps = {}> = InlineFormikConfig<Values> &
  ExtraProps & {
    isSubmitting?: boolean;
    error?: Error | FetchError;
  };

export default function InlineFormik<
  Values extends FormikValues = FormikValues,
  ExtraProps = {}
>(props: InlineFormikProps<Values, ExtraProps>) {
  const {
    children,
    innerRef,
    initialValues,
    isSubmitting,
    error,
    onSubmit,
    ...remainingProps
  } = props;
  const formikRef = useRef<FormikValues>();
  // make a copy of the initialValues for use when comparing changes;
  // cached values are updated prior to submitting to retain changes;
  // we don't want to keep updating initialValues as that will cause
  // UI re-render.
  const [cachedValues, setCachedValues] = useState(initialValues);
  useEffect(() => {
    // updated cached values if initial values change
    setCachedValues(initialValues);
  }, [initialValues]);
  useEffect(() => {
    if (formikRef && formikRef.current) {
      formikRef.current.setSubmitting(isSubmitting);
    }
  }, [isSubmitting]);

  return error ? (
    // Display Error
    <StyledErrorBox>
      <ReportProblemIcon fontSize='large' color='error' />
      <Typography variant='h5' className='error-title'>
        An error occurred!
      </Typography>
      <Typography variant='body1' className='error-body'>
        There was a problem loading the form. Please reload the browser and try
        again.
      </Typography>
      {(error as Error).message && (
        <code>
          <u>Error</u>: {(error as Error).message}
        </code>
      )}
      {(error as FetchError).error && (
        <code>{(error as FetchError).error}</code>
      )}
    </StyledErrorBox>
  ) : initialValues ? (
    <Formik
      innerRef={formik => {
        // keep a reference of the formik object
        formikRef.current = formik;
        // forward the formik object if needed
        if (innerRef) innerRef(formik);
      }}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values: Values, formikHelpers: FormikHelpers<Values>) => {
        const valuesDiff = diff(cachedValues, values);
        console.log('InlineFormik onSubmit', cachedValues, values);
        // console.log('valuesDiff', valuesDiff);
        if (valuesDiff) {
          // set the cached values to prevent resubmitting the form; this
          // helps if saving is slow and user is making fast changes
          setCachedValues(values);
          // only submit diff changes for inline form sbimission
          onSubmit(valuesDiff as Values, formikHelpers);
        } else if (formikRef && formikRef.current) {
          // if no value changes don't submit anything
          formikRef.current.setSubmitting(false);
        }
      }}
      {...remainingProps}
    >
      {children}
    </Formik>
  ) : (
    <CircularProgress />
  );
}
