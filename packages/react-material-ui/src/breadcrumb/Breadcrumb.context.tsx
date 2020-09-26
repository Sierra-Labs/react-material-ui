import { Breadcrumbs } from '@material-ui/core';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer
} from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbData {
  label: string;
  path?: string;
}

export interface BreadcrumbContextState {
  breadcrumbs: BreadcrumbData[];
  dispatch: React.Dispatch<BreadcrumbReducerAction>;
}

export const BreadcrumbContext = createContext<BreadcrumbContextState>({
  breadcrumbs: [],
  dispatch: () => {}
});

export const useBreadcrumb = (newBreadcrumb?: BreadcrumbData) => {
  // console.log('useBreadcrumb');
  const { dispatch } = useContext(BreadcrumbContext);
  const [breadcrumb, setBreadcrumb] = useState(newBreadcrumb);
  useEffect(() => {
    // console.log('useEffect useBreadcrumb', breadcrumb);
    if (breadcrumb) {
      dispatch({ type: 'add', breadcrumb });
      return () => {
        // console.log('component unmounted');
        dispatch({ type: 'remove', breadcrumb });
      };
    }
  }, [breadcrumb, dispatch]);
  return { setBreadcrumb };
};

export interface BreadcrumProviderProps {
  initial?: BreadcrumbData[];
}

type BreadcrumbReducerAction =
  | { type: 'replace'; breadcrumbs: BreadcrumbData[] }
  | { type: 'add'; breadcrumb: BreadcrumbData }
  | { type: 'remove'; breadcrumb: BreadcrumbData };

/**
 * Breadcrumb Context Provider initializes the breadcrumb array and sets up
 * the methods for adding and removing breadcrumb items.
 * @param props
 */
const BreadcrumbProvider: React.FC<BreadcrumProviderProps> = props => {
  // console.log('render BreadcrumbProvider');
  const { children, initial = [] } = props;
  // const initialRef = useRef(initial);
  const [breadcrumbs, dispatch] = useReducer(
    (
      breadcrumbs: BreadcrumbData[],
      action: BreadcrumbReducerAction
    ): BreadcrumbData[] => {
      switch (action.type) {
        case 'replace':
          return action.breadcrumbs;
        case 'add':
          // console.log('adding breadcrumb', action.breadcrumb);
          return [...breadcrumbs, action.breadcrumb];
        case 'remove':
          // console.log('removing breadcrumb', action.breadcrumb);
          return breadcrumbs.filter(b => b !== action.breadcrumb);
      }
    },
    initial
  );

  // useEffect(() => {
  //   console.log('check same as previous init', initial !== initialRef.current);
  //   console.log('breadcrumbs', breadcrumbs);
  //   if (initial !== breadcrumbs && initial !== initialRef.current) {
  //     console.log('replace', initialRef.current, 'with', initial);
  //     breadcrumbs.splice(0, initialRef.current.length);
  //     initialRef.current = initial;
  //     dispatch({
  //       type: 'replace',
  //       breadcrumbs: [...initial, ...breadcrumbs]
  //     });
  //   }
  // }, [breadcrumbs, initial]);

  // useEffect(() => {
  //   console.log('saved previous', initialRef.current);
  //   initialRef.current = initial;
  // }, [initial]);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        dispatch
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const BreadcrumbHeading: React.FC = () => {
  const { breadcrumbs } = useContext(BreadcrumbContext);
  // console.log('render BreadcrumHeading', breadcrumbs);
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

export default BreadcrumbProvider;
