import React from 'react';
import styled from 'styled-components';

import { CircularProgress } from '@material-ui/core';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
export const PageTemplateSpinner: React.FC<React.ComponentProps<
  typeof StyledDiv
>> = ({ className, ...props }) => {
  return (
    <StyledDiv
      className={`page-template-spinner${className ? ` ${className}` : ''}`}
      {...props}
    >
      <CircularProgress />
    </StyledDiv>
  );
};

export default PageTemplateSpinner;
