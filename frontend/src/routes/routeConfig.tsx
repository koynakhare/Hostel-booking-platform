import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import OwnerLayout from "@/components/layout/OwnerLayout";
import StudentLayout from "@/components/layout/StudentLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import OwnerDashboardPage from "@/features/owner/pages/OwnerDashboardPage";
import ManageHostelsPage from "@/features/owner/pages/ManageHostelsPage";
import HostelFormPage from "@/features/owner/pages/HostelFormPage";
import ManageRoomsPage from "@/features/owner/pages/ManageRoomsPage";
import OwnerBookingsPage from "@/features/owner/pages/OwnerBookingsPage";
import PaymentSettingsPage from "@/features/owner/pages/PaymentSettingsPage";
import BrowseHostelsPage from "@/features/student/pages/BrowseHostelsPage";
import HostelDetailsPage from "@/features/student/pages/HostelDetailsPage";
import BookingCheckoutPage from "@/features/student/pages/BookingCheckoutPage";
import MyBookingsPage from "@/features/student/pages/MyBookingsPage";
import PaymentSuccessPage from "@/features/student/pages/PaymentSuccessPage";
import { OWNER_ROUTES, ROLES, STUDENT_ROUTES } from "@/utils/constants";

export type LayoutType = "public" | "owner" | "student";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  layout?: LayoutType;
  roles?: (typeof ROLES)[keyof typeof ROLES][];
}

export const routeConfig: RouteConfig[] = [
  { path: "/login", element: <LoginPage />, layout: "public" },
  { path: "/register", element: <RegisterPage />, layout: "public" },
  {
    path: OWNER_ROUTES.dashboard,
    element: <OwnerDashboardPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: OWNER_ROUTES.hostels,
    element: <ManageHostelsPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: OWNER_ROUTES.hostelNew,
    element: <HostelFormPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: "/owner/hostels/:id/edit",
    element: <HostelFormPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: "/owner/hostels/:hostelId/rooms",
    element: <ManageRoomsPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: OWNER_ROUTES.bookings,
    element: <OwnerBookingsPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: OWNER_ROUTES.payments,
    element: <PaymentSettingsPage />,
    layout: "owner",
    roles: [ROLES.OWNER],
  },
  {
    path: STUDENT_ROUTES.browse,
    element: <BrowseHostelsPage />,
    layout: "student",
    roles: [ROLES.STUDENT],
  },
  {
    path: "/student/hostels/:id",
    element: <HostelDetailsPage />,
    layout: "student",
    roles: [ROLES.STUDENT],
  },
  {
    path: "/student/checkout/:hostelId",
    element: <BookingCheckoutPage />,
    layout: "student",
    roles: [ROLES.STUDENT],
  },
  {
    path: STUDENT_ROUTES.myBookings,
    element: <MyBookingsPage />,
    layout: "student",
    roles: [ROLES.STUDENT],
  },
  {
    path: STUDENT_ROUTES.paymentSuccess,
    element: <PaymentSuccessPage />,
    layout: "student",
    roles: [ROLES.STUDENT],
  },
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
];

export function wrapWithLayout(route: RouteConfig): ReactNode {
  const { element, layout, roles } = route;

  if (layout === "owner") {
    return (
      <ProtectedRoute roles={[ROLES.OWNER]}>
        <OwnerLayout>{element}</OwnerLayout>
      </ProtectedRoute>
    );
  }

  if (layout === "student") {
    return (
      <ProtectedRoute roles={[ROLES.STUDENT]}>
        <StudentLayout>{element}</StudentLayout>
      </ProtectedRoute>
    );
  }

  if (roles) {
    return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;
  }

  return element;
}
