import React from 'react';
import styled from 'styled-components';

const StyledVerticalStepper = styled.div`
  width: 240px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
`;

const VerticalStepper: React.FC = props => {
  const { children } = props;
  // React.Children.map(children, (child, index) => {
  //   const reactElement = child as ReactElement;
  //   if (reactElement) {
  //     if (reactElement.type === VerticalStep) {
  //       if (reactElement.props.step === undefined) {
  //         // default step prop
  //         reactElement.props.step = index + 1;
  //       }
  //     }
  //   }
  // });
  return <StyledVerticalStepper>{children}</StyledVerticalStepper>;
};

export default VerticalStepper;
