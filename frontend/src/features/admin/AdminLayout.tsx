import { type ReactNode, useEffect, useState } from "react";
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
  Receipt,
  MessageCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "../../store";
import { NotificationBell } from "../../components/NotificationBell";
import type { ActivePage } from "../../types";
import { apiFetch } from "../../services/apiClient";

const NAV_ITEMS: { page: ActivePage; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "admin-users", label: "User Management", icon: Users },
  { page: "admin-meetings", label: "Meeting Management", icon: CalendarClock },
  { page: "admin-conversions", label: "Conversion History", icon: History },
  { page: "admin-reports", label: "Reports", icon: BarChart3 },
  { page: "admin-invoices", label: "Payment invoices", icon: Receipt },
  { page: "admin-settings", label: "Settings", icon: Settings },
  { page: "admin-chat", label: "Chat", icon: MessageCircle },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { activePage, setActivePage, session, logout } = useAppStore();
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await apiFetch<{ success: boolean; total: number }>("/api/chat/unread");
        if (data.success) setUnreadChats(data.total || 0);
      } catch { /* keep the last known count during transient failures */ }
    };
    loadUnread();
    const timer = window.setInterval(loadUnread, 3000);
    window.addEventListener("chat:read", loadUnread);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("chat:read", loadUnread);
    };
  }, []);

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
    <div className="admin-shell min-h-screen flex flex-col">
      {/* Admin header - deliberately separate from the public site's Header */}
      <header className="admin-header sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-sky-600" />
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-800">
              ALSM <span className="text-sm font-semibold text-sky-600">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50"><User className="h-3.5 w-3.5 text-sky-600" /></span>
              <span className="hidden max-w-40 truncate sm:block">{session.name || session.email}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <aside className="shrink-0 lg:w-64">
          <div className="admin-sidebar lg:sticky lg:top-[104px] lg:rounded-2xl lg:border lg:border-slate-200/80 lg:bg-white lg:p-3 lg:shadow-sm">
            <div className="mb-3 hidden items-center gap-2 rounded-xl bg-gradient-to-br from-slate-950 to-slate-800 px-3 py-3.5 text-white lg:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Sparkles className="h-4 w-4 text-sky-300" /></span>
              <div><p className="text-xs font-bold">Control center</p><p className="text-[10px] text-slate-400">Platform operations</p></div>
            </div>
          <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`group shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left ${
                  activePage === page || (page === "admin-users" && activePage === "admin-user-detail")
                    ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-inset ring-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${activePage === page ? "bg-white text-sky-600 shadow-sm" : "bg-slate-50 text-slate-400 group-hover:text-slate-700"}`}><Icon className="h-4 w-4 shrink-0" /></span>
                <span>{label}</span>
                {page === "admin-chat" && unreadChats > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-rose-200">
                    {unreadChats > 99 ? "99+" : unreadChats}
                  </span>
                )}
                <ChevronRight className="ml-auto hidden h-3.5 w-3.5 opacity-40 lg:block" />
              </button>
            ))}
            <hr className="my-2 border-slate-100 hidden lg:block" />
            <button
              onClick={logout}
              className="shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition text-left text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </nav>
          </div>
        </aside>

        <main className="admin-content min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
