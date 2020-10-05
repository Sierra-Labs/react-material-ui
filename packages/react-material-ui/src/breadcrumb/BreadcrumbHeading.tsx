import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from '@material-ui/core';

import { BreadcrumbContext } from './Breadcrumb.context';
import { useBreadcrumb } from './Breadcrumb.hooks';
import { Breadcrumb } from './Breadcrumb.interface';

/**
 * Displays the current breadcrumb in the context
 */
export const BreadcrumbHeading: React.FC<{
  breadcrumb?: Breadcrumb;
}> = ({ breadcrumb }) => {
  const { breadcrumbs } = useContext(BreadcrumbContext);
  const { setBreadcrumb } = useBreadcrumb(breadcrumb);
  const breadcrumbRef = useRef(breadcrumb);
  useEffect(() => {
    // check breadcrumb props against previous value to determine if any
    // changes occurred and if so notify the breadcrumb context to refresh
    if (
      breadcrumbRef.current?.label !== breadcrumb?.label ||
      breadcrumbRef.current?.path !== breadcrumb?.path
    ) {
      breadcrumbRef.current = breadcrumb;
      setBreadcrumb(breadcrumb);
    }
  }, [breadcrumb, setBreadcrumb]);

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {breadcrumbs.map(breadcrumb => (
        <h1 key={`${breadcrumb.label}::${breadcrumb.path}`}>
          {breadcrumb.path ? (
            <Link color='inherit' to={breadcrumb.path}>
              {breadcrumb.label}
            </Link>
          ) : (
            breadcrumb.label
          )}
        </h1>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbHeading;
