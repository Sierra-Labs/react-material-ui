import React from 'react';

import { Box, Card, CardContent, CssBaseline } from '@material-ui/core';
import { Story } from '@storybook/react';

import { storyRootPath } from '../index.stories';
import { AppThemeProvider } from '../theme-provider';
import PageTemplate from './PageTemplate';
import PageTemplateCardOver from './PageTemplateCardOver';
import PageTemplateHeader from './PageTemplateHeader';

export default {
  component: PageTemplateCardOver,
  title: `${storyRootPath}/Page Templates/PageTemplateCardOver`
};

const Template: Story<{}> = args => (
  <AppThemeProvider>
    <CssBaseline />
    <PageTemplate>
      <PageTemplateHeader>
        <h2>Header Title</h2>
      </PageTemplateHeader>
      <PageTemplateCardOver>
        <CardContent>
          <Box mb={2}>Page Content using the "Card Over" template</Box>
        </CardContent>
      </PageTemplateCardOver>
    </PageTemplate>
  </AppThemeProvider>
);

export const Default = Template.bind({});
Default.args = {};
