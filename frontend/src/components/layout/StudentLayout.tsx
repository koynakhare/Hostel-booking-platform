import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Sidebar, { NavIcon } from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { STUDENT_ROUTES } from "@/utils/constants";

const studentNav = [
  {
    path: STUDENT_ROUTES.browse,
    label: "Browse Hostels",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    path: STUDENT_ROUTES.myBookings,
    label: "My Bookings",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </NavIcon>
    ),
  },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  [STUDENT_ROUTES.browse]: {
    title: "Browse Hostels",
    subtitle: "Find and book the perfect hostel near your campus",
  },
  [STUDENT_ROUTES.myBookings]: {
    title: "My Bookings",
    subtitle: "View your upcoming and past hostel bookings",
  },
};

export default function StudentLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const meta = Object.entries(pageMeta).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1] ?? { title: "Student Panel", subtitle: "" };

  return (
    <div className="flex min-h-screen bg-bg-page">
      <Sidebar
        title="Hostel Booking"
        subtitle="Student Panel"
        navItems={studentNav}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
