import React, { createContext, useCallback, useContext, useState } from 'react';
// import Helmet from 'react-helmet';

import { BreadcrumbItem } from './BreadcrumbItem';

export const BreadcrumbContext = createContext<{
  breadcrumbs: BreadcrumbItem[];
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  updateBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  removeBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
}>(null!);

export const useBreadcrumContext = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      'useBreadcrumbContext must be used within the BreadcrumbProvider component'
    );
  }
  return context;
};

const findBreadcrumbIndex = (
  breadcrumbs: BreadcrumbItem[],
  breadcrumb: BreadcrumbItem
) => {
  let index = breadcrumbs.findIndex(
    b => b === breadcrumb || b.path === breadcrumb.path
  );
  if (index === -1) {
    throw new Error(`Breadcrumb path not found: ${breadcrumb.path}`);
  }
  return index;
};

/**
 * Breadcrumb Context Provider initializes the breadcrumb array and sets up
 * the methods for setting breadcrumb items.
 * @param props
 */
export const BreadcrumbProvider: React.FC<{
  label?: string | JSX.Element;
  path?: string;
  initial?: BreadcrumbItem[];
}> = ({
  label,
  path,
  initial = [], // default to empty array if not provided
  children
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(
    label ? [{ label, path }, ...initial] : initial
  );
  const addBreadcrumb = useCallback((breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs(breadcrumbs => [...breadcrumbs, breadcrumb]);
  }, []);
  const updateBreadcrumb = useCallback((breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs(breadcrumbs => {
      const index = findBreadcrumbIndex(breadcrumbs, breadcrumb);
      breadcrumbs[index] = breadcrumb;
      return [...breadcrumbs];
    });
  }, []);
  const removeBreadcrumb = useCallback((breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs(breadcrumbs => {
      const index = findBreadcrumbIndex(breadcrumbs, breadcrumb);
      breadcrumbs.splice(index, 1);
      return [...breadcrumbs];
    });
  }, []);
  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        addBreadcrumb,
        updateBreadcrumb,
        removeBreadcrumb
      }}
    >
      {/* <Helmet title={breadcrumbs.map(b => b.label).join(' / ')} /> */}
      {children}
    </BreadcrumbContext.Provider>
  );
};
