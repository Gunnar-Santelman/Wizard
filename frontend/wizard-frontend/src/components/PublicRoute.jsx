import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// sets public route protocol for unprotected routes
function PublicRoute() {

  const { user } = useAuth();

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/home" replace/>;
  }

  return <Outlet/>;
}

export default PublicRoute;