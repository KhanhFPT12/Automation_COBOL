import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useAppStore } from "../store";

const TYPE_DOT: Record<string, string> = {
  meeting_approved: "bg-emerald-500",
  meeting_rejected: "bg-rose-500",
  meeting_cancelled: "bg-slate-400",
  meeting_reminder: "bg-amber-500",
  meeting_completed: "bg-sky-500",
  meeting_new_admin: "bg-amber-500",
  payment_success: "bg-emerald-500",
  payment_success_admin: "bg-emerald-500",
};

export function NotificationBell() {
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead, setActivePage } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-50 transition"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markNotificationRead(n._id);
                      if (n.type === "meeting_new_admin") {
                        setActivePage("admin-meetings");
                      } else if (n.meeting) {
                        sessionStorage.setItem("alsm_view_meeting_id", n.meeting);
                        setActivePage("meeting-detail");
                      } else if (n.type === "payment_success") {
                        setActivePage("billing");
                      } else if (n.type === "payment_success_admin") {
                        setActivePage("admin-invoices");
                      }
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition ${!n.isRead ? "bg-sky-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${TYPE_DOT[n.type] || "bg-slate-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
