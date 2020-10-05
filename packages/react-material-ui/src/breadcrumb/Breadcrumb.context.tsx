import React, { createContext, useCallback, useRef, useState } from 'react';
// import Helmet from 'react-helmet';

import { Breadcrumb } from './Breadcrumb.interface';

export const BreadcrumbContext = createContext<{
  breadcrumbs: Breadcrumb[];
  registerBreadcrumb: (breadcrumb?: Breadcrumb) => number;
  updateBreadcrumb: (index: number, breadcrumb: Breadcrumb) => void;
  removeBreadcrumb: (index: number) => void;
}>({
  breadcrumbs: [],
  registerBreadcrumb: breadcrumb => 0,
  updateBreadcrumb: (index, breadcrumb) => {},
  removeBreadcrumb: index => {}
});

/**
 * Breadcrumb Context Provider initializes the breadcrumb array and sets up
 * the methods for setting breadcrumb items.
 * @param props
 */
export const BreadcrumbProvider: React.FC<{ initial?: Breadcrumb[] }> = ({
  children,
  initial = [] // default to empty array if not provided
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(initial);
  const breadcrumbsRef = useRef(breadcrumbs);
  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        registerBreadcrumb: useCallback(breadcrumb => {
          // setup the breadcrumb and return the index of the breadcrumb
          const index = breadcrumbsRef.current.length;
          if (breadcrumb) {
            breadcrumb.index = index;
          }
          breadcrumbsRef.current.push(breadcrumb || { index, label: '' });
          setBreadcrumbs([...breadcrumbsRef.current]);
          // console.log('registerBreadcrumb', breadcrumb, index);
          return index;
        }, []),
        updateBreadcrumb: useCallback((index, breadcrumb) => {
          // find the breadcrumb and update it or insert at correct position;
          // insert is needed because breadcrumb may have been removed due to
          // unmount.
          const arrayIndex = breadcrumbsRef.current.findIndex(
            b => b.index === index
          );
          if (arrayIndex > -1) {
            breadcrumbsRef.current[arrayIndex] = breadcrumb;
          } else {
            breadcrumb.index = index;
            breadcrumbsRef.current.splice(index, 0, breadcrumb);
          }
          // console.log('updateBreadcrumb', index, breadcrumbsRef.current);
          setBreadcrumbs([...breadcrumbsRef.current]);
        }, []),
        removeBreadcrumb: useCallback(index => {
          // console.log('removeBreadcrumb', index);
          const arrayIndex = breadcrumbsRef.current.findIndex(
            b => b.index === index
          );
          breadcrumbsRef.current.splice(arrayIndex, 1);
          setBreadcrumbs([...breadcrumbsRef.current]);
        }, [])
      }}
    >
      {/* <Helmet title={breadcrumbs.map(b => b.label).join(' / ')} /> */}
      {children}
    </BreadcrumbContext.Provider>
  );
};
