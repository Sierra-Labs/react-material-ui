import React from 'react';

import { Grid, GridProps, GridTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

type InlineFormContent = GridProps<
  OverridableComponent<GridTypeMap<{}, 'div'>>
>;

const InlineFormContent: React.FC<InlineFormContent> = props => {
  const { children } = props;
  return (
    <Grid item {...props}>
      {children}
    </Grid>
  );
};

export default InlineFormContent;
