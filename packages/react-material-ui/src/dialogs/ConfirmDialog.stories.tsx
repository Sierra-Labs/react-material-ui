import React, { useState } from 'react';

import { Button } from '@material-ui/core';
import { Story } from '@storybook/react';

import { storyRootPath } from '../index.stories';
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog';

export default {
  component: ConfirmDialog,
  title: `${storyRootPath}/Dialogs/ConfirmDialog`,
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' }
  }
};

const Template: Story<ConfirmDialogProps> = args => {
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
      <ConfirmDialog
        {...args}
        open={openDialog}
        onCancel={() => setOpenDialog(false)}
        onConfirm={() => setOpenDialog(false)}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: 'Confirm Dialog',
  message: 'Message body in the dialog.'
};
