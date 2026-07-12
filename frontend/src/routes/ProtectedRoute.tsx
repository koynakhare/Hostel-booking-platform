import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  selectIsAuthenticated,
  selectRole,
} from "@/features/auth/authSlice";
import { OWNER_ROUTES, ROLES, STUDENT_ROUTES, type Role } from "@/utils/constants";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

function dashboardForRole(role: Role | null): string {
  if (role === ROLES.OWNER) return OWNER_ROUTES.dashboard;
  if (role === ROLES.STUDENT) return STUDENT_ROUTES.browse;
  return "/login";
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to={dashboardForRole(role)} replace />;
  }

  return <>{children}</>;
}
