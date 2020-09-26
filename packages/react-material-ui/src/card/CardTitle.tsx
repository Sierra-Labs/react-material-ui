import React from 'react';
import styled from 'styled-components';

import { Typography, TypographyProps } from '@material-ui/core';

const StyledCardTitleTypography = styled(Typography)`
  display: flex;
  align-items: center;
  /* margin-bottom: 10px; */
  padding: 16px 16px 0 16px;
  .MuiSvgIcon-root {
    margin-right: 10px;
  }
`;
export default function CardTitle(props: TypographyProps) {
  const { children } = props;
  return (
    <StyledCardTitleTypography
      className='card-title'
      variant='overline'
      {...props}
    >
      {children}
    </StyledCardTitleTypography>
  );
}
