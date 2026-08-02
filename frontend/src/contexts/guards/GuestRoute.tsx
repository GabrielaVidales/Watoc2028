import { Navigate, Outlet } from "react-router";
import { useAuth } from "../AuthContext";
import LoadingPage from "../LoadingPage";

export type GuestRouteProps = {
    redirectTo?: string
}

export function GuestRoute({ redirectTo = '/' }: GuestRouteProps) {
    const { user: user } = useAuth()

    if (user === undefined) {
        return <LoadingPage />
    }

    if (user) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}