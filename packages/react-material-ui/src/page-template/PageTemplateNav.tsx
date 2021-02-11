import React from 'react';
import styled from 'styled-components';

const StyledPageTemplateNav = styled.div`
  display: flex;
  background: #fff;
  margin: 0 -30px;
  padding: 0 30px;
  &.tabs {
    flex-direction: column;
    padding: 0;
  }
`;

export const PageTemplateNav: React.FC<
  React.ComponentProps<typeof StyledPageTemplateNav> & { tabs?: boolean }
> = ({ tabs, children, className, ...props }) => {
  return (
    <StyledPageTemplateNav
      className={`page-template-nav${className ? ` ${className}` : ''}${
        tabs ? ' tabs' : ''
      }`}
      {...props}
    >
      {children}
    </StyledPageTemplateNav>
  );
};

export default PageTemplateNav;
