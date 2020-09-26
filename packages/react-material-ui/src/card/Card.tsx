import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledCard = styled(MuiCard)`
  &.clickable {
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }
`;

export interface CardProps extends MuiCardProps {}

const Card: React.FC<CardProps> = props => {
  const { children, onClick, className = '' } = props;
  const classes = className.split(' ');
  if (onClick) {
    classes.push('clickable');
  }
  return (
    <StyledCard {...props} className={classes.join(' ')}>
      {children}
    </StyledCard>
  );
};

export default Card;
