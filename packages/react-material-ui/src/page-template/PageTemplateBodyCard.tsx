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

export const PageTemplateBodyCard: React.FC = props => {
  const { children } = props;
  return (
    <StyledPaper elevation={2} className='page-template-body'>
      {children}
    </StyledPaper>
  );
};

export default PageTemplateBodyCard;
