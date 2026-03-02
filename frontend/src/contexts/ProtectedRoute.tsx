import * as React from 'react';
import { useAuth } from './AuthContext';
import LoadingPage from './LoadingPage';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/schemas/user-schemas';

type ProtectedRouteProps = React.PropsWithChildren & {
    allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { currentUser } = useAuth()
    
    if (currentUser === undefined) {
        return <LoadingPage/>
    }
    
    if (!currentUser) {
        return <Navigate to='/login' replace />
    }
        
    const authorized = currentUser?.roles.some(
        role => allowedRoles?.includes(role)
    )
    
    if (!authorized) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />;
}
