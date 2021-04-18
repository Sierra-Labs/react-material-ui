import React from 'react';
import styled from 'styled-components';

export const StyledStatusLabel = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background: #efefef;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  &.small {
    font-size: 9px;
    padding: 2px 5px;
    border-radius: 4px;
    margin: 0 0 0 6px;
  }
  transition: background 0.25s cubic-bezier(0.075, 0.82, 0.165, 1),
    color 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.approved,
  &.published,
  &.completed {
    background: ${props =>
      props.theme.statusLabel?.completed?.background || '#61cdbb'};
    color: ${props => props.theme.statusLabel?.completed?.color || '#000'};
  }
  &.warn,
  &.in-review,
  &.in-progress {
    background: ${props =>
      props.theme.statusLabel?.inProgress?.background || 'rgb(241, 225, 91)'};
    color: ${props => props.theme.statusLabel?.inProgress?.color || '#000'};
  }
  &.draft {
    background: ${props =>
      props.theme.statusLabel?.draft?.background || 'rgb(33, 150, 243)'};
    color: ${props => props.theme.statusLabel?.draft?.color || '#fff'};
  }
  &.to-do,
  &.incomplete,
  &.cancelled,
  &.error {
    background: ${props =>
      props.theme.statusLabel?.error?.background || '#f47560'};
    color: ${props => props.theme.statusLabel?.error?.color || '#fff'};
  }
`;

export const StatusLabelTypes = [
  'completed',
  'warn',
  'in-progress',
  'incomplete',
  'draft',
  'to-do',
  'in-review',
  'approved',
  'published',
  'error'
] as const;

export type StatusLabelType = typeof StatusLabelTypes[number];

export const getStatusText = (status?: StatusLabelType) => {
  if (!status) {
    return 'Unknown Status';
  }
  switch (status) {
    case 'in-progress':
      return 'In Progress';
    case 'in-review':
      return 'In Review';
    default:
      // return _.startCase(status);
      return status;
  }
};

export interface StatusLabelProps {
  status?: string;
  color?: StatusLabelType;
  small?: boolean;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({
  color,
  status,
  small
}) => {
  const classStatus = status?.toLowerCase().trim().replace(' ', '-');
  return (
    <StyledStatusLabel
      className={`status-label ${color || classStatus}${small ? ' small' : ''}`}
    >
      {getStatusText(status as StatusLabelType)}
    </StyledStatusLabel>
  );
};

export default StatusLabel;
