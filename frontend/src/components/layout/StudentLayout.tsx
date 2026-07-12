import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import StudentNavbar from "@/components/layout/StudentNavbar";
import { STUDENT_ROUTES } from "@/utils/constants";

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  [STUDENT_ROUTES.myBookings]: {
    title: "My Bookings",
    subtitle: "View your upcoming and past hostel bookings",
  },
};

const compactHeaderRoutes = [STUDENT_ROUTES.myBookings];

function isBrowsePage(pathname: string) {
  return pathname === STUDENT_ROUTES.browse || pathname === STUDENT_ROUTES.browse + "/";
}

function isDetailOrCheckout(pathname: string) {
  return (
    pathname.startsWith("/student/hostels/")
    || pathname.startsWith("/student/checkout/")
    || pathname.startsWith(STUDENT_ROUTES.paymentSuccess)
  );
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const showPageHeader = !isBrowsePage(location.pathname) && !isDetailOrCheckout(location.pathname);

  const meta = Object.entries(pageMeta).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1];
  const compactHeader = compactHeaderRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      <StudentNavbar />
      <main className="flex-1">
        {showPageHeader && meta && (
          <div className="border-b border-border-subtle bg-card-bg">
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${compactHeader ? "py-4" : "py-8"}`}>
              <h1 className={`font-bold text-text-primary ${compactHeader ? "text-xl" : "text-2xl"}`}>
                {meta.title}
              </h1>
              {meta.subtitle && (
                <p className="mt-0.5 text-sm text-text-muted">{meta.subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </main>
      <footer className="border-t border-border-subtle bg-card-bg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-text-primary">Hostel Booking</p>
          <p className="text-xs text-text-muted">
            Find and book the perfect hostel near your campus
          </p>
        </div>
      </footer>
    </div>
  );
}
