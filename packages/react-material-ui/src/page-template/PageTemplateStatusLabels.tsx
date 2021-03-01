import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  margin-top: 8px;
  .status-label {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const PageTemplateStatusLabels: React.FC<React.ComponentProps<
  typeof StyledDiv
>> = ({ className, children, ...props }) => {
  return (
    <StyledDiv
      className={`page-template-status-labels${
        className ? ` ${className}` : ''
      }`}
      {...props}
    >
      {children}
    </StyledDiv>
  );
};

export default PageTemplateStatusLabels;
