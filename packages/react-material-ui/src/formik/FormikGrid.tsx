import React from 'react';
import { GridProps, Grid } from '@material-ui/core';
import styled from 'styled-components';

const StyleGrid = styled(Grid)`
  padding: 10px 0 20px 0;
`;
const FormikGrid: React.FC<GridProps> = props => {
  const { children, spacing = 2 } = props;
  return (
    <StyleGrid container spacing={spacing} {...props}>
      {children}
    </StyleGrid>
  );
};

export default FormikGrid;
