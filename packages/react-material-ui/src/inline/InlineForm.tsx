import React, { ElementType } from 'react';
import { Grid, GridProps } from '@material-ui/core';
import { Form } from 'formik';
import styled from 'styled-components';

type InlineFormCardProps = GridProps<ElementType<HTMLFormElement>>;

const StyledInlineFormGrid = styled(Grid)`
  h3 {
    font-size: 32px;
  }
  h5 {
    font-size: 14px;
  }
` as React.FC<InlineFormCardProps>;

const InlineForm: React.FC<InlineFormCardProps> = props => {
  const { spacing = 2, children } = props;
  return (
    <StyledInlineFormGrid
      container
      component={Form}
      wrap='wrap'
      spacing={spacing}
      {...props}
    >
      {children}
    </StyledInlineFormGrid>
  );
};

export default InlineForm;
