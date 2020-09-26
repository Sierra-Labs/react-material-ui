import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router';
import { GuardFunction } from '../guards/guard';

type ProtectedRouteProps = RouteProps & {
  guards?: Array<GuardFunction>;

  // Will use to redirect when all guards failed to activate
  // By default it will redirect to `/login`
  redirectTo?: string;
};

function ProtectedRoute(props: ProtectedRouteProps) {
  console.log('ProtectedRoute render');
  const { guards = [] } = props;
  const isAllowed = guards.some(guard => guard().canActivate());

  if (!isAllowed) {
    return <Redirect to='/login' />;
  }
  return <Route {...props} />;
}

export default ProtectedRoute;
