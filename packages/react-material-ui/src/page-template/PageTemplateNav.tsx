import React from 'react';
import styled from 'styled-components';

const StyledPageTemplateNav = styled.div`
  display: flex;
  background: #fff;
  margin: 0 -30px;
  padding: 0 30px;
`;

const PageTemplateNav: React.FC = props => {
  const { children } = props;
  return (
    <StyledPageTemplateNav className='page-template-nav'>
      {children}
    </StyledPageTemplateNav>
  );
};

export default PageTemplateNav;
