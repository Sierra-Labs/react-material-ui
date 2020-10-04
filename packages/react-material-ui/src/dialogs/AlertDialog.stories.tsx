import React, { useState } from 'react';

import { Button } from '@material-ui/core';
import { Story } from '@storybook/react';

import { storyRootPath } from '../index.stories';
import AlertDialog, { AlertDialogProps } from './AlertDialog';

export default {
  component: AlertDialog,
  title: `${storyRootPath}/Dialogs/AlertDialog`,
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
    buttonLabels: { control: 'array' }
  }
};

const Template: Story<AlertDialogProps> = args => {
  const [openDialog, setOpenDialog] = useState(args.open);
  return (
    <>
      <Button
        color='primary'
        variant='contained'
        onClick={() => setOpenDialog(true)}
      >
        Launch {args.title}
      </Button>
      <AlertDialog
        {...args}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: 'Alert Dialog',
  message: 'Message body in the dialog.'
};
