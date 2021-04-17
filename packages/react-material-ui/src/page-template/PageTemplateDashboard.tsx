import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0 -30px;
  padding: 20px 30px 0 30px;
` as React.FC<React.HTMLProps<HTMLDivElement>>;

export const PageTemplateDashboard: React.FC<React.HTMLProps<
  HTMLDivElement
>> = ({ children, ...props }) => {
  return (
    <StyledDiv className='page-template-dashboard' {...props}>
      {children}
    </StyledDiv>
  );
};

export default PageTemplateDashboard;
