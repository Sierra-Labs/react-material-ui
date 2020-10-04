import React from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

const StyledPaper = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  .MuiTableContainer-root {
    flex: 1;
    overflow: auto;
  }
  ${props => props.theme.breakpoints.down('sm')} {
    border-radius: 0;
  }
`;

export const PageTemplateCardOver: React.FC = props => {
  const { children } = props;
  return (
    <StyledPaper elevation={2} className='card-over'>
      {children}
    </StyledPaper>
  );
};

export default PageTemplateCardOver;
