import { AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

function AdminRoute() {
    const { user, loading } = useContext(AuthContext);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
