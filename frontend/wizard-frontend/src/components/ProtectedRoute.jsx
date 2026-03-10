import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

function ProtectedRoute({ children }) {
  const {user, onboardingComplete} = useAuth();

  const location = useLocation();

console.log("ProtectedRoute state:", {
  user,
  onboardingComplete,
  path: location.pathname
});

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  if (onboardingComplete === null) {
    return <p>Loading...</p>;
  }

  if (onboardingComplete && location.pathname === "/onboarding") {
    return <Navigate to="/home" replace/>;
  }

  if (!onboardingComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace/>;
  }

  return <Outlet/>;
}

export default ProtectedRoute;