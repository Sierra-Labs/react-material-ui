import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0 -30px;
  padding: 20px 30px 0 30px;
`;

const PageTemplateDashboard: React.FC = props => {
  const { children } = props;
  return <StyledDiv className='page-template-dashboard'>{children}</StyledDiv>;
};

export default PageTemplateDashboard;
