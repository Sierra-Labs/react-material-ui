import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0 -30px;
` as React.FC<React.HTMLProps<HTMLDivElement>>;

export const PageTemplateBody: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <StyledDiv className='page-template-body' {...props}>
      {children}
    </StyledDiv>
  );
};

export default PageTemplateBody;
