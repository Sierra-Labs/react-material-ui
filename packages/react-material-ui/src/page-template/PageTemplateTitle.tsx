import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PageTemplateTitle: React.FC<React.ComponentProps<
  typeof StyledDiv
>> = ({ className, children, ...props }) => {
  return (
    <StyledDiv
      className={`page-template-title${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </StyledDiv>
  );
};

export default PageTemplateTitle;
