import React, { useEffect } from 'react';

import { useBreadcrumContext } from './BreadcrumbContext';
import { BreadcrumbItem } from './BreadcrumbItem';

export interface BreadcrumpProps {
  breadcrumb: BreadcrumbItem;
}

export const Breadcrumb: React.FC<BreadcrumpProps> = ({
  breadcrumb,
  children
}) => {
  const {
    breadcrumbs,
    addBreadcrumb,
    removeBreadcrumb
  } = useBreadcrumContext();

  useEffect(() => {
    if (breadcrumb) {
      addBreadcrumb(breadcrumb);
      return () => removeBreadcrumb(breadcrumb);
    }
  }, [breadcrumb, addBreadcrumb, removeBreadcrumb]);
  return <>{children}</>;
};

export default Breadcrumb;
