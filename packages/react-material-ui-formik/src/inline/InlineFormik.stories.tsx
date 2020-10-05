import React, { useRef, useState } from 'react';

import { Box, CssBaseline } from '@material-ui/core';
import { Story } from '@storybook/react';

import { storyRootPath } from '../index.stories';
import { InlineFormik } from './InlineFormik';
import { InlineForm } from './InlineForm';
import { InlineTextField } from './InlineTextField';
import { InlineRadioGroup } from './InlineRadioGroup';
import { InlineNumberField } from './InlineNumberField';
import { FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { AppThemeProvider } from '@sierralabs/react-material-ui';

export default {
  component: InlineFormik,
  title: `${storyRootPath}/Inline/InlineFormik`
};

interface User {
  firstName: string;
  lastName: string;
  gender: string;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  notes: string;
}

const Template: Story<{}> = args => {
  const formikRef = useRef<FormikProps<FormikValues> | null>();
  const [user, setUser] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    gender: '',
    height: 0,
    heightUnit: '',
    weight: 0,
    weightUnit: '',
    notes: ''
  });
  return (
    <AppThemeProvider>
      <CssBaseline />
      <InlineFormik
        innerRef={formik => (formikRef.current = formik)}
        initialValues={user}
        validationSchema={Yup.object({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required')
        })}
        // isSubmitting={isUpdating}
        // error={findError}
        onSubmit={(userDto: Partial<User>) => {
          console.log('onSubmit', userDto);
          setUser({ ...user, ...userDto });
          formikRef.current.isSubmitting = false;
        }}
      >
        <InlineForm>
          <InlineTextField
            name='firstName'
            label='First Name'
            placeholder="What is the user's first name?"
            grid={{ xs: 12, sm: 6 }}
          />
          <InlineTextField
            name='lastName'
            label='Last Name'
            placeholder="What is the user's last name?"
            grid={{ xs: 12, sm: 6 }}
          />
          <InlineRadioGroup
            name='gender'
            label='Gender'
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
            ]}
          />
          <InlineNumberField
            name='height'
            label='Height'
            placeholder='What is the height of the user?'
          />
          <InlineRadioGroup
            name='heightUnit'
            label='Height Unit'
            options={[
              { value: 'in', label: 'Inches (in)' },
              { value: 'cm', label: 'Centimeter (cm)' }
            ]}
          />
          <InlineNumberField
            name='weight'
            label='Weight'
            placeholder='What is the weight of the user?'
          />
          <InlineRadioGroup
            name='weightUnit'
            label='Weight Unit'
            options={[
              { value: 'lb', label: 'Pounds (lb)' },
              { value: 'kg', label: 'Kilogram (Kg)' }
            ]}
          />
          <InlineTextField
            multiline
            name='notes'
            label='Notes'
            placeholder='Internal use only. Provide any notes about the user.'
          />
        </InlineForm>
      </InlineFormik>
    </AppThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
