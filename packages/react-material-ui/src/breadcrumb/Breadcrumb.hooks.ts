import { Breadcrumb } from './Breadcrumb.interface';
import { useContext, useState, useEffect, useMemo } from 'react';
import { BreadcrumbContext } from './Breadcrumb.context';

/**
 * For manually setting a single breadcrumb
 * @param newBreadcrumb
 */
export const useBreadcrumb = (newBreadcrumb?: Breadcrumb) => {
  const { registerBreadcrumb, updateBreadcrumb, removeBreadcrumb } = useContext(
    BreadcrumbContext
  );
  const [breadcrumb, setBreadcrumb] = useState(newBreadcrumb);

  // register the breadcrumb and get the index of the breadcrumb on mount
  const index = useMemo(
    () => registerBreadcrumb(breadcrumb),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // hanlde updates to the breadcrumb
  useEffect(() => {
    if (breadcrumb) {
      updateBreadcrumb(index, breadcrumb);
    }
    return () => {
      // remove breadcrumb on unmount
      removeBreadcrumb(index);
    };
  }, [
    breadcrumb,
    index,
    registerBreadcrumb,
    removeBreadcrumb,
    updateBreadcrumb
  ]);
  return { breadcrumb, setBreadcrumb };
};

/**
 * For manually setting multiple breadcrumbs
 * @param newBreadcrumbs
 */
export const useBreadcrumbs = (newBreadcrumbs?: Breadcrumb[]) => {
  const { registerBreadcrumb, updateBreadcrumb, removeBreadcrumb } = useContext(
    BreadcrumbContext
  );
  const [breadcrumbs, setBreadcrumbs] = useState(newBreadcrumbs || []);
  const indexArray = useMemo(
    () => breadcrumbs.map(breadcrumb => registerBreadcrumb(breadcrumb)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    if (breadcrumbs) {
      breadcrumbs.forEach((breadcrumb, index) => {
        updateBreadcrumb(indexArray[index], breadcrumb);
      });
    }
    return () => {
      // remove breadcrumb on unmount
      for (let i = indexArray.length - 1; i >= 0; i--) {
        removeBreadcrumb(indexArray[i]);
      }
    };
  }, [
    breadcrumbs,
    indexArray,
    registerBreadcrumb,
    removeBreadcrumb,
    updateBreadcrumb
  ]);
  return { breadcrumbs, setBreadcrumbs };
};
