import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropType from "prop-types";
import { AuthContext } from "@/providers/auth-provider";

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropType.node.isRequired,
};

export default PublicRoute;
