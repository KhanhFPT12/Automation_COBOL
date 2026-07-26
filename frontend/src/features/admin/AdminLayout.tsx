import { type ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  BarChart3,
  Settings,
  ShieldAlert,
  Shield,
  LogOut,
  Receipt,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Globe,
  ExternalLink,
  Search,
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
  const [pendingMeetings, setPendingMeetings] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("admin-global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await apiFetch<{ success: boolean; total: number }>("/api/chat/unread");
        if (data.success) setUnreadChats(data.total || 0);
      } catch { /* keep the last known count during transient failures */ }
    };
    const loadPending = async () => {
      try {
        const data = await apiFetch<{ success: boolean; count: number }>("/api/admin/meetings/pending-count");
        if (data.success) setPendingMeetings(data.count || 0);
      } catch { /* ignore */ }
    };
    loadUnread();
    loadPending();
    const chatTimer = window.setInterval(loadUnread, 3000);
    const meetingTimer = window.setInterval(loadPending, 10000);
    window.addEventListener("chat:read", loadUnread);
    return () => {
      window.clearInterval(chatTimer);
      window.clearInterval(meetingTimer);
      window.removeEventListener("chat:read", loadUnread);
    };
  }, []);

  const searchItems = [
    { label: "Dashboard", desc: "Overview, stats & recent activity", page: "admin-dashboard" as ActivePage, icon: LayoutDashboard, keywords: "home stats live overview" },
    { label: "User Management", desc: "Manage accounts, roles & usage limits", page: "admin-users" as ActivePage, icon: Users, keywords: "users accounts roles email user" },
    { label: "Meeting Management", desc: "Approve or reject booking requests", page: "admin-meetings" as ActivePage, icon: CalendarClock, badge: pendingMeetings, keywords: "meetings calendar schedule google meet pending approve reject cuộc họp" },
    { label: "Conversion History", desc: "View COBOL conversion logs", page: "admin-conversions" as ActivePage, icon: History, keywords: "conversions files history code cobol" },
    { label: "Payment Invoices", desc: "Subscription packages & Casso payments", page: "admin-invoices" as ActivePage, icon: Receipt, keywords: "invoices payments casso billing revenue money hóa đơn thanh toán" },
    { label: "Reports & Analytics", desc: "System analytics & revenue charts", page: "admin-reports" as ActivePage, icon: BarChart3, keywords: "reports analytics metrics performance báo cáo" },
    { label: "Admin Settings", desc: "Google OAuth & Casso API settings", page: "admin-settings" as ActivePage, icon: Settings, keywords: "settings config google casso integration cài đặt" },
    { label: "Admin Chat", desc: "Live chat with users", page: "admin-chat" as ActivePage, icon: MessageCircle, badge: unreadChats, keywords: "chat messages support live hỗ trợ tin nhắn" },
  ];

  const filteredItems = searchItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.keywords.includes(q);
  });

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
      {/* Redesigned Admin Header */}
      <header className="admin-header sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Title */}
          <button
            onClick={() => setActivePage("admin-dashboard")}
            className="flex items-center gap-3 text-left hover:opacity-90 transition cursor-pointer group"
          >
            <img
              src="/images/alsm2-logo.png"
              alt="ALSM Logo"
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black tracking-widest text-sky-700 uppercase bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/90 leading-none w-max shadow-2xs">
                Admin Center
              </span>
              <span className="text-[11px] font-semibold text-slate-400 mt-1.5 leading-none">Management & Operations</span>
            </div>
          </button>

          {/* Middle Admin Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="admin-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Quick search or navigate (Ctrl + K)..."
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-10 pr-12 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-2xs transition-all focus:bg-white focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 shadow-2xs pointer-events-none">
                ⌘K
              </kbd>
            </div>

            {/* Quick Navigation Results Dropdown */}
            {searchFocused && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchFocused(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {searchQuery.trim() ? `Search results for "${searchQuery}"` : "Quick Navigation"}
                  </div>

                  {filteredItems.length === 0 ? (
                    <p className="text-xs text-slate-400 p-3 text-center">No matching pages found.</p>
                  ) : (
                    <div className="space-y-0.5 mt-1">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.page}
                            onClick={() => {
                              setActivePage(item.page);
                              setSearchFocused(false);
                              setSearchQuery("");
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50/80 text-left transition group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-sky-100 group-hover:text-sky-600 transition">
                                <Icon className="h-4 w-4 text-slate-600 group-hover:text-sky-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 group-hover:text-sky-900">{item.label}</p>
                                <p className="text-[11px] text-slate-400">{item.desc}</p>
                              </div>
                            </div>
                            {item.badge && item.badge > 0 ? (
                              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                                {item.badge}
                              </span>
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage("home")}
              title="Preview Client Website"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Main App</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <NotificationBell />

            {/* Interactive Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white px-2.5 py-1.5 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 font-bold text-white text-xs shadow-xs">
                  {(session.name || session.email || "A").charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="max-w-[110px] truncate text-xs font-bold text-slate-800 leading-snug">{session.name || session.email}</span>
                  <span className="text-[10px] font-bold text-sky-600 leading-none mt-0.5">Super Admin</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180 text-sky-600" : ""}`} />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-60 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{session.name || "Administrator"}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{session.email}</p>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold text-sky-700 ring-1 ring-sky-200/80">
                        <Shield className="h-3 w-3" /> Super Administrator
                      </span>
                    </div>

                    <div className="space-y-0.5 text-xs font-semibold">
                      <button
                        onClick={() => {
                          setActivePage("admin-settings");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition text-left cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Admin Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("admin-reports");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition text-left cursor-pointer"
                      >
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                        <span>Reports & Analytics</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("home");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition text-left cursor-pointer sm:hidden"
                      >
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span>Go to Client App</span>
                      </button>
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <aside className="shrink-0 lg:w-64">
          <div className="admin-sidebar lg:sticky lg:top-[104px] lg:rounded-2xl lg:border lg:border-slate-200/80 lg:bg-white lg:p-3 lg:shadow-sm">
            <div className="mb-3.5 hidden items-center gap-3 rounded-2xl bg-gradient-to-br from-[#0061FF] via-[#2563EB] to-[#6366F1] p-4 text-white shadow-md shadow-blue-500/20 lg:flex relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 text-white shadow-xs">
                <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
              </span>
              <div>
                <p className="text-xs font-extrabold tracking-wide uppercase text-white leading-tight">Control Center</p>
                <p className="text-[11px] font-medium text-blue-100/90 leading-tight mt-0.5">Platform operations</p>
              </div>
            </div>
            <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
                const isActive = activePage === page || (page === "admin-users" && activePage === "admin-user-detail");
                return (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`group shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? "bg-gradient-to-r from-[#0061FF] to-[#3B82F6] text-white shadow-md shadow-[#0061FF]/25 font-extrabold"
                        : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                      isActive 
                        ? "bg-white/20 text-white shadow-xs" 
                        : "bg-slate-100 text-slate-400 group-hover:bg-[#0061FF]/10 group-hover:text-[#0061FF]"
                    }`}>
                      <Icon className="h-4 w-4 shrink-0" />
                    </span>
                    <span>{label}</span>
                    {page === "admin-meetings" && pendingMeetings > 0 && (
                      <span className={`ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-black leading-none shadow-xs ${
                        isActive ? "bg-amber-400 text-slate-950" : "bg-amber-500 text-white shadow-amber-200"
                      }`}>
                        {pendingMeetings > 99 ? "99+" : pendingMeetings}
                      </span>
                    )}
                    {page === "admin-chat" && unreadChats > 0 && (
                      <span className={`ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-black leading-none shadow-xs ${
                        isActive ? "bg-white text-rose-600" : "bg-rose-500 text-white shadow-rose-200"
                      }`}>
                        {unreadChats > 99 ? "99+" : unreadChats}
                      </span>
                    )}
                    <ChevronRight className={`ml-auto hidden h-3.5 w-3.5 transition-opacity lg:block ${isActive ? "text-white opacity-80" : "opacity-40 group-hover:opacity-100"}`} />
                  </button>
                );
              })}
              <div className="mt-3 pt-3 border-t border-slate-100 lg:mt-5">
                <button
                  onClick={logout}
                  className="w-full shrink-0 flex items-center gap-2.5 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition text-left text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <main className="admin-content min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
