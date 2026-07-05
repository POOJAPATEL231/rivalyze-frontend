import { Navigate, Outlet } from "react-router";

import { useAppSelector } from "@/store/hooks";

export function PublicRoute() {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/brief" replace />;
    }

    return <Outlet />;
}
