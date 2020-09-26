import React, { MouseEvent } from 'react';
import styled from 'styled-components';

const StyledStep = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  color: #999;
  cursor: pointer;
  &.completed,
  &.selected {
    color: #555;
    .step-number {
      border-color: #039be5;
      color: #000;
      font-weight: 500;
    }
  }
  &.selected {
    background: #e1f5fe;
    color: #000;
    font-weight: 500;
  }
  .step-index {
    margin-right: 12px;
  }
  .step-number {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    min-width: 28px;
    max-width: 28px;
    border-radius: 100%;
    border: 2px solid rgba(0, 0, 0, 0.12);
    background: #fafafa;
    font-size: 12px;
    z-index: 1;
    box-sizing: border-box;
  }

  /* line connector */
  &:not(:first-child) {
    .step-index:before {
      position: absolute;
      top: 0;
      display: block;
      content: '';
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      width: 1px;
      height: 50%;
      left: 29px;
      z-index: 0;
    }
  }
  &:not(:last-child) {
    .step-index:after {
      position: absolute;
      bottom: 0;
      display: block;
      content: '';
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      width: 1px;
      height: 50%;
      left: 29px;
      z-index: 0;
    }
  }
`;

interface VerticalStepProps {
  label: string;
  step?: number;
  completed?: boolean;
  selected?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const VerticalStep: React.FC<VerticalStepProps> = props => {
  const { label, step, completed, selected, onClick } = props;
  const getStepClass = (): string => {
    const classes = [];
    if (completed) {
      classes.push('completed');
    }
    if (selected) {
      classes.push('selected');
    }
    return classes.join(' ');
  };

  return (
    <StyledStep className={`step ${getStepClass()}`} onClick={onClick}>
      <div className='step-index'>
        <span className='step-number'>{step}</span>
      </div>
      <div className='step-title'>{label}</div>
    </StyledStep>
  );
};

export default VerticalStep;
