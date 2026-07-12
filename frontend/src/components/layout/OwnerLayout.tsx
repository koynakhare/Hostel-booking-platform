import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Sidebar, { NavIcon } from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { OWNER_ROUTES } from "@/utils/constants";

const ownerNav = [
  {
    path: OWNER_ROUTES.dashboard,
    label: "Dashboard",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </NavIcon>
    ),
  },
  {
    path: OWNER_ROUTES.hostels,
    label: "Hostels",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </NavIcon>
    ),
  },
  {
    path: OWNER_ROUTES.bookings,
    label: "Bookings",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </NavIcon>
    ),
  },
  {
    path: OWNER_ROUTES.payments,
    label: "Payments",
    icon: (
      <NavIcon>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </NavIcon>
    ),
  },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  [OWNER_ROUTES.dashboard]: {
    title: "Dashboard",
    subtitle: "Hostel overview, bookings, and revenue at a glance",
  },
  [OWNER_ROUTES.hostels]: {
    title: "Manage Hostels",
    subtitle: "Add, edit, and manage your hostel listings",
  },
  [OWNER_ROUTES.bookings]: {
    title: "Bookings",
    subtitle: "View room-wise booking status across your hostels",
  },
  [OWNER_ROUTES.payments]: {
    title: "Payment Settings",
    subtitle: "Configure Razorpay, Stripe, or cash payment options",
  },
};

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const meta = Object.entries(pageMeta).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1] ?? { title: "Owner Panel", subtitle: "" };

  return (
    <div className="flex min-h-screen bg-bg-page">
      <Sidebar
        title="Hostel Booking"
        subtitle="Owner Panel"
        navItems={ownerNav}
        ctaLabel="+ New Hostel"
        ctaPath={OWNER_ROUTES.hostelNew}
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
