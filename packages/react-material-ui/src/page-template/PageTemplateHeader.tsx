import React from 'react';
import styled from 'styled-components';
import blue from '@material-ui/core/colors/blue';

const StyledHeader = styled.div`
  display: flex;
  color: #fff;
  padding: 42px 0;
  align-items: center;
  white-space: nowrap;
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    color: #fff;
  }
  h2 {
    font-size: 22px;
  }
  .subtitle {
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.8);
  }
  a {
    color: #fff;
    &:hover {
      color: ${blue[100]};
    }
  }
  ${props => props.theme.breakpoints.down('sm')} {
    flex-wrap: wrap;
    h1,
    h2,
    h3,
    h4 {
      flex: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .MuiBreadcrumbs-root {
      flex: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      ol {
        flex-wrap: nowrap;
        /* justify-content: flex-end;
        padding-right: 10px; */
      }
    }
    .page-template-header-actions {
      flex: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-box {
      order: 5;
      flex: 100%;
      margin: 10px 0 0 0;
      .search {
        padding: 12px;
        max-width: 100%;
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #eee;
      }
    }
  }
`;

const StyledCardHeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  &.flex {
    flex: 1;
  }
  .MuiButton-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export interface PageTemplateHeaderActionsProps {
  flex?: boolean;
}

export const PageTemplateHeaderActions: React.FC<PageTemplateHeaderActionsProps> = props => {
  const { flex, children } = props;
  return (
    <StyledCardHeaderActions
      className={`page-template-header-actions ${flex && 'flex'}`}
    >
      {children}
    </StyledCardHeaderActions>
  );
};

export const PageTemplateHeader: React.FC<React.ComponentProps<
  typeof StyledHeader
>> = ({ className, children, ...props }) => {
  return (
    <StyledHeader
      className={`page-template-header${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </StyledHeader>
  );
};

export default PageTemplateHeader;
