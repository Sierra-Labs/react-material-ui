import React, { useEffect } from 'react';

import { useBreadcrumContext } from './BreadcrumbContext';
import { BreadcrumbItem } from './BreadcrumbItem';

export interface BreadcrumpProps {
  label?: string | JSX.Element;
  path?: string;
  breadcrumb?: BreadcrumbItem;
}

export const Breadcrumb: React.FC<BreadcrumpProps> = ({
  label,
  path,
  breadcrumb,
  children
}) => {
  const { addBreadcrumb, removeBreadcrumb } = useBreadcrumContext();

  useEffect(() => {
    const crumb = label ? { label, path } : breadcrumb;
    if (crumb) {
      addBreadcrumb(crumb);
      return () => removeBreadcrumb(crumb);
    }
  }, [label, path, breadcrumb, addBreadcrumb, removeBreadcrumb]);
  return <>{children}</>;
};

export default Breadcrumb;
