import React from 'react';
import {
  CardContent as MuiCardContent,
  CardContentProps as MuiCardContentProps
} from '@material-ui/core';
import styled from 'styled-components';

const StyledCardContent = styled(MuiCardContent)`
  &.primary {
    background: ${props => props.theme.palette.primary.dark};
    color: ${props => props.theme.palette.primary.contrastText};
  }
  &.secondary {
    background: ${props => props.theme.palette.secondary.dark};
    color: ${props => props.theme.palette.secondary.contrastText};
  }

  &.small {
    padding: 16px;
  }
  &.medium {
    padding: 16px 32px;
    &:last-child {
      padding-bottom: 32px;
    }
  }
  &.large {
    padding: 16px 50px;
    &:last-child {
      padding-bottom: 50px;
    }
  }
  ${props => props.theme.breakpoints.down('sm')} {
    &.small,
    &.medium,
    &.large {
      padding: 16px;
    }
  }
` as React.FC<CardContentProps>;

export interface CardContentProps extends MuiCardContentProps {
  padding?: 'small' | 'medium' | 'large';
  background?: 'primary' | 'secondary';
}

export const CardContent: React.FC<CardContentProps> = props => {
  const { children, padding = 'small', background } = props;

  const getClassName = () => {
    const classes: any[] = [padding];
    if (background) {
      classes.push(background);
    }
    return classes.join(' ');
  };

  return (
    <StyledCardContent className={getClassName()} {...props}>
      {children}
    </StyledCardContent>
  );
};

export default CardContent;
