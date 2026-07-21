import { type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  User,
} from "lucide-react";
import { useAppStore } from "../../store";
import { NotificationBell } from "../../components/NotificationBell";
import type { ActivePage } from "../../types";

const NAV_ITEMS: { page: ActivePage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "admin-users", label: "User Management", icon: Users },
  { page: "admin-meetings", label: "Meeting Management", icon: CalendarClock },
  { page: "admin-conversions", label: "Conversion History", icon: History },
  { page: "admin-reports", label: "Reports", icon: BarChart3 },
  { page: "admin-settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { activePage, setActivePage, session, logout } = useAppStore();

  if (session.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShieldAlert className="h-14 w-14 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access denied</h2>
        <p className="text-slate-500 text-sm mb-6">
          This area is restricted to ALSM platform administrators.
        </p>
        <button
          onClick={() => setActivePage("home")}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin header - deliberately separate from the public site's Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-sky-600" />
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-800">
              ALSM <span className="text-sky-600 text-sm font-semibold">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="flex items-center gap-1.5 text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
              <User className="h-3.5 w-3.5 text-sky-600" />
              {session.name || session.email}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 flex-1 w-full">
        <aside className="lg:w-60 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-lg transition text-left ${
                  activePage === page || (page === "admin-users" && activePage === "admin-user-detail")
                    ? "bg-sky-50 text-sky-700 border border-sky-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
            <hr className="my-2 border-slate-100 hidden lg:block" />
            <button
              onClick={logout}
              className="shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-lg transition text-left text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
