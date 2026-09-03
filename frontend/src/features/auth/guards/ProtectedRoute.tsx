import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../../../contexts/LoadingPage';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/features/users/schemas/user-schemas';
import { routes } from '@/routes/routes';
import VerifyYourEmailPage from '@/pages/auth/not_verified/page';

type ProtectedRouteProps = React.PropsWithChildren & {
    allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user: user } = useAuth()

    if (user === undefined) {
        return <LoadingPage />
    }

    if (!user) {
        return <Navigate to={routes.auth.login} replace />
    }

    if (!user.is_active) {
        return (
            <div className='h-screen flex flex-col justify-center items-center'>
                <h1 className='text-2xl font-semibold'>
                    Your account is deactivated
                </h1>
            </div>
        )
    }

    const authorized = user?.roles.some(role => allowedRoles?.includes(role))
    if (!authorized) {
        return <Navigate to={routes.users.profile} replace />
    }

    if (!user.roles.includes('admin') && !user.email_verified) {
        return <VerifyYourEmailPage />
    }

    return <Outlet />;
}
