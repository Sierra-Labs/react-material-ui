import React from 'react';
import styled from 'styled-components';

import { CircularProgress } from '@material-ui/core';

const StyledSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
export const PageTemplateSpinner: React.FC = () => {
  return (
    <StyledSpinnerContainer>
      <CircularProgress />
    </StyledSpinnerContainer>
  );
};

export default PageTemplateSpinner;
