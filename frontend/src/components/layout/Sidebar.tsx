import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
  profilePath?: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({
  title,
  subtitle,
  navItems,
  ctaLabel,
  ctaPath,
  profilePath,
  showLogout,
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-hidden bg-sidebar-bg">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-text-on-dark">{title}</p>
            <p className="text-xs text-text-on-dark-muted">{subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={
              item.path.endsWith("/dashboard")
              || item.path.endsWith("/hostels")
              || item.path.endsWith("/profile")
            }
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive
                ? "sidebar-nav-active font-medium"
                : "text-text-on-dark-muted hover:bg-white/5 hover:text-text-on-dark"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        {user && (
          <div className="px-1">
            {profilePath ? (
              <button
                type="button"
                onClick={() => navigate(profilePath)}
                className="flex w-full items-start gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-white/5"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-text-on-dark-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <p className="truncate text-xs font-medium text-text-on-dark hover:text-accent">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-text-on-dark-muted hover:text-accent/80">
                    {user.email}
                  </p>
                </span>
              </button>
            ) : (
              <>
                <p className="truncate text-xs font-medium text-text-on-dark">{user.fullName}</p>
                <p className="truncate text-xs text-text-on-dark-muted">{user.email}</p>
              </>
            )}
          </div>
        )}
        {ctaLabel && ctaPath && (
          <Button className="w-full cursor-pointer" onClick={() => navigate(ctaPath)}>
            {ctaLabel}
          </Button>
        )}
        {onLogout && (
          <Button
            variant="ghost"
            className="w-full !bg-white !text-black hover:!bg-white/90 cursor-pointer"
            onClick={onLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}

export function NavIcon({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span className={active ? "text-accent" : "text-text-on-dark-muted"}>
      {children}
    </span>
  );
}
