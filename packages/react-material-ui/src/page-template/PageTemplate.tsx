import React, { ReactElement } from 'react';
import styled from 'styled-components';
import PageTemplateNav from './PageTemplateNav';
import PageTemplateCardOver from './PageTemplateCardOver';
import PageTemplateHeader from './PageTemplateHeader';
import { SearchBox } from '../search';

const StyledPageTemplate = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 30px;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    ${props =>
      props.theme.pageTemplate?.headerBackground ||
      props.theme.palette.primary.dark},
    ${props =>
        props.theme.pageTemplate?.headerBackground ||
        props.theme.palette.primary.dark}
      117px,
    ${props => props.theme.palette.secondary.light} 0%
  );
  .page-template-header {
    height: 117px;
    overflow: hidden;
  }
  &.page-template-tabs {
    background: linear-gradient(
      to bottom,
      ${props =>
        props.theme.pageTemplate?.headerBackground ||
        props.theme.palette.primary.dark},
      ${props =>
          props.theme.pageTemplate?.headerBackground ||
          props.theme.palette.primary.dark}
        117px,
      ${props => props.theme.palette.secondary.light} 0%
    );
  }
  &.card-over {
    background: linear-gradient(
      to bottom,
      ${props =>
        props.theme.pageTemplate?.headerBackground ||
        props.theme.palette.primary.dark},
      ${props =>
          props.theme.pageTemplate?.headerBackground ||
          props.theme.palette.primary.dark}
        183px,
      ${props => props.theme.palette.secondary.light} 0%
    );
    .page-template-header {
      height: 126px;
      overflow: hidden;
    }
  }

  .page-template-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* Tables in the Card Over templte should scroll in place */
    .MuiTableContainer-root {
      flex: 1;
      overflow: auto;
    }
  }
  ${props => props.theme.breakpoints.down('sm')} {
    padding: 0 10px;
    &.search .page-template-header {
      padding: 24px 0 0 0;
    }
    .page-template-nav {
      /* margin-top: 42px; */
    }
  }
`;

export const PageTemplate: React.FC<{ className?: string }> = props => {
  const { children } = props;
  let { className = '' } = props;
  className += ' page-template';
  React.Children.map(children, child => {
    // check if CardOverNav exists
    const reactElement = child as ReactElement;
    if (reactElement) {
      if (reactElement.type === PageTemplateHeader) {
        React.Children.map(
          reactElement.props.children,
          (child: ReactElement) => {
            if (child?.type === SearchBox) {
              className += ' search';
            }
          }
        );
      } else if (reactElement.type === PageTemplateNav) {
        className += ' page-template-tabs';
      } else if (reactElement.type === PageTemplateCardOver) {
        className += ' card-over';
      }
    }
  });
  return (
    <StyledPageTemplate className={className}>{children}</StyledPageTemplate>
  );
};

export default PageTemplate;
