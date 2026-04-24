import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/api";

interface ProtectedRouteProps {
  children: ReactElement;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { firebaseUser, appUser, loading } = useAuth();

  if (loading || (firebaseUser && !appUser)) {
    return (
      <div className="min-h-screen grid place-items-center bg-surface text-muted-foreground">
        Loading secure session...
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && appUser && !roles.includes(appUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
