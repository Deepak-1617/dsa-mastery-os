import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
  const { userId, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="page-center">
        <p>Loading your workspace…</p>
      </main>
    );
  }

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profile && !profile.onboardingCompleted && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
