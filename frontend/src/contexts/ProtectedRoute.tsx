import * as React from 'react';
import { useAuth, type User } from './AuthContext';
import { Navigate, Outlet } from 'react-router';
import LoadingPage from './LoadingPage';

type ProtectedRouteProps = React.PropsWithChildren & {
    allowedRoles?: User['role'][]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { currentUser } = useAuth()

    if (currentUser === undefined) {
        return <LoadingPage/>
    }    

    if (currentUser === null || (allowedRoles && !allowedRoles.includes(currentUser?.role))) {
        return <Navigate to='/register' replace />
    }

    // if (!currentUser?.data?.emailConfirmed) {
    //     return <div>You must confirm your email!</div>
    // }

    return <Outlet />;
}

export function GuestRoute() {
    const { currentUser } = useAuth()

    if (currentUser) {
        return <Navigate to="/success" replace />;
    }

    return <Outlet />;
}