import React from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

const StyledDiv = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 -30px;
  overflow: hidden;
  border-radius: 0;
  .MuiTableContainer-root {
    flex: 1;
    overflow: auto;
  }
`;

const PageTemplateBodyCard: React.FC = props => {
  const { children } = props;
  return <StyledDiv className='page-template-body'>{children}</StyledDiv>;
};

export default PageTemplateBodyCard;
