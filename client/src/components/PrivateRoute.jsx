import { AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
