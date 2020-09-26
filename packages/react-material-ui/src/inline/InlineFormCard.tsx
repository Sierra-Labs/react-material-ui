import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import Card from '../card/Card';
import CardContent from '../card/CardContent';

const StyledCard = styled(Card)`
  form {
    /* padding: 0 32px; */
  }
  .inline-description {
    margin-bottom: 30px;
  }
  .card-title {
    margin-bottom: 20px;
  }
`;

export interface InlineFormCardProps {
  label?: string;
  description?: string;
}

const InlineFormCard: React.FC<InlineFormCardProps> = props => {
  const { label, description, children } = props;
  return (
    <StyledCard className='survey-form-card'>
      <CardContent padding='large'>
        {label && (
          <Typography variant='h3' gutterBottom className='inline-title'>
            {label}
          </Typography>
        )}
        {description && (
          <Typography variant='subtitle2' className='inline-description'>
            {description}
          </Typography>
        )}
        {children}
      </CardContent>
    </StyledCard>
  );
};

const StyledActionsDiv = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  button,
  a {
    margin-right: 20px;
    :last-child {
      margin-right: 0;
    }
  }
`;

export const InlineActions: React.FC = props => {
  const { children } = props;
  return (
    <StyledActionsDiv className='inline-actions'>{children}</StyledActionsDiv>
  );
};

export default InlineFormCard;
