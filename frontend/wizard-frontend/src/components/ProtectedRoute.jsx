import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

function ProtectedRoute({ children }) {
  const {user, userData, loading} = useAuth();

  const location = useLocation();

  if (user === undefined || loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  const onboardingComplete = userData?.completedOnboarding;

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