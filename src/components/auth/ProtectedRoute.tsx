import { Navigate, Outlet, useLocation } from "react-router";

import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute() {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}
