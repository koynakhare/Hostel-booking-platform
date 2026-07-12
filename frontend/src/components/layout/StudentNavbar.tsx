import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, selectUser } from "@/features/auth/authSlice";
import { showToast } from "@/features/toast/toastSlice";
import { STUDENT_ROUTES } from "@/utils/constants";

const navLinks = [
  { path: STUDENT_ROUTES.browse, label: "Home", end: true },
  { path: STUDENT_ROUTES.myBookings, label: "My Bookings", end: true },
];

export default function StudentNavbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: "Logged out successfully.", type: "info" }));
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-card-bg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={STUDENT_ROUTES.browse} className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary">Hostel Booking</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:bg-bg-page hover:text-text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-text-muted hover:bg-bg-page md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border-subtle bg-card-bg px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-accent/10 text-accent" : "text-text-muted"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {user && (
            <div className="mt-4 border-t border-border-subtle pt-4">
              <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
              <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
