import { type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  BarChart3,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useAppStore } from "../../store";
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
  const { activePage, setActivePage, session } = useAppStore();

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-60 shrink-0">
        <div className="mb-4 px-1">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Admin</p>
          <p className="text-lg font-extrabold text-slate-900">ALSM Admin</p>
        </div>
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
        </nav>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
