import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";
import LoadingPage from "./LoadingPage";

export type GuestRouteProps = {
    redirectTo?: string
}

export function GuestRoute({ redirectTo = '/' }: GuestRouteProps) {
    const { currentUser } = useAuth()

    if (currentUser === undefined) {
        return <LoadingPage />
    }

    if (currentUser) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}