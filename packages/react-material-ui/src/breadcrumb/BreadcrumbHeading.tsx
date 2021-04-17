import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumbs, Typography } from '@material-ui/core';

import { useBreadcrumContext } from './BreadcrumbContext';
import { BreadcrumbItem } from './BreadcrumbItem';

/**
 * Displays the current breadcrumb in the context
 */
export const BreadcrumbHeading: React.FC<{
  label?: string | JSX.Element;
  path?: string;
  breadcrumb?: BreadcrumbItem;
}> = ({ label, path, breadcrumb }) => {
  const {
    breadcrumbs,
    addBreadcrumb,
    removeBreadcrumb
  } = useBreadcrumContext();

  useEffect(() => {
    const crumb = label ? { label, path } : breadcrumb;
    if (crumb) {
      addBreadcrumb(crumb);
      return () => removeBreadcrumb(crumb);
    }
  }, [label, path, breadcrumb, addBreadcrumb, removeBreadcrumb]);
  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {breadcrumbs.map(breadcrumb => (
        <Typography
          variant='h2'
          key={`${breadcrumb.label}::${breadcrumb.path}`}
        >
          {breadcrumb.path ? (
            <Link color='inherit' to={breadcrumb.path}>
              {breadcrumb.label}
            </Link>
          ) : (
            breadcrumb.label
          )}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbHeading;
