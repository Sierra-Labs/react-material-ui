import React from 'react';

import { Box, CssBaseline } from '@material-ui/core';
import { Story } from '@storybook/react';

import { storyRootPath } from '../index.stories';
import { AppThemeProvider } from '../theme-provider';
import PageTemplate from './PageTemplate';
import PageTemplateDashboard from './PageTemplateDashboard';
import PageTemplateHeader from './PageTemplateHeader';

export default {
  component: PageTemplate,
  title: `${storyRootPath}/Page Templates/PageTemplate`
};

const Template: Story<{}> = args => (
  <AppThemeProvider>
    <CssBaseline />
    <PageTemplate>
      <PageTemplateHeader>
        <h2>Header Title</h2>
      </PageTemplateHeader>
      <PageTemplateDashboard>
        <Box mb={2}>Page Content</Box>
      </PageTemplateDashboard>
    </PageTemplate>
  </AppThemeProvider>
);

export const Default = Template.bind({});
Default.args = {};
