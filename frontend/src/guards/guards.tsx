import type React from 'react';
import { useAuth } from '../context/auth.context';
import { Navigate } from 'react-router';

type GuardProps = React.PropsWithChildren<{
  redirect: string;
}>;

export function AuthenticatedGuard(props: GuardProps) {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    return <>{props.children}</>;
  } else {
    return <Navigate to={props.redirect} replace />;
  }
}

export function UnauthenticatedGuard(props: GuardProps) {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <>{props.children}</>;
  } else {
    return <Navigate to={props.redirect} replace />;
  }
}
