import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps, CircularProgress } from '@material-ui/core';

const StyledDiv = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
export const PageTemplateSpinner: React.FC<BoxProps> = ({
  className,
  ...props
}) => {
  return (
    <StyledDiv
      className={`page-template-spinner${className ? ` ${className}` : ''}`}
      {...props}
    >
      <CircularProgress className='circular-progress' />
    </StyledDiv>
  );
};

export default PageTemplateSpinner;
