import * as React from 'react';
import { useAuth } from './AuthContext';
import LoadingPage from './LoadingPage';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/schemas/user-schemas';
import { urls } from '@/routes/routes';
import VerifyYourEmailPage from '@/pages/auth/not_verified/page';

type ProtectedRouteProps = React.PropsWithChildren & {
    allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { currentUser } = useAuth()

    if (currentUser === undefined) {
        return <LoadingPage />
    }

    if (!currentUser) {
        return <Navigate to={urls.auth.login} replace />
    }

    if (!currentUser.is_active) {
        return (
            <div className='h-screen flex flex-col justify-center items-center'>
                <h1 className='text-2xl font-semibold'>
                    Your account is deactivated
                </h1>
            </div>
        )
    }

    const authorized = currentUser?.roles.some(
        role => allowedRoles?.includes(role)
    )

    if (!authorized) {
        return <Navigate to={urls.auth.login} replace />
    }

    if (!currentUser.roles.includes('admin') && !currentUser.email_verified) {
        return <VerifyYourEmailPage />
    }

    return <Outlet />;
}
