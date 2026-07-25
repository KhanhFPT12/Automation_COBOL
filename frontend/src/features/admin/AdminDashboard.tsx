import { useEffect, useState } from "react";
import {
  Users,
  CalendarClock,
  Hourglass,
  CheckCircle2,
  XCircle,
  FileCode2,
  Loader2,
  Banknote,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { adminApi } from "../../services/adminApi";
import type { ActivityItem, DashboardCharts, DashboardStats } from "../../types";

const STAT_CARDS: { key: keyof DashboardStats; label: string; icon: typeof Users; color: string }[] = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-sky-600 bg-sky-50" },
  { key: "totalMeetings", label: "Total Meetings", icon: CalendarClock, color: "text-indigo-600 bg-indigo-50" },
  { key: "pendingMeetings", label: "Pending Approval", icon: Hourglass, color: "text-amber-600 bg-amber-50" },
  { key: "approvedMeetings", label: "Approved Meetings", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { key: "rejectedMeetings", label: "Rejected Meetings", icon: XCircle, color: "text-rose-600 bg-rose-50" },
  { key: "totalConversions", label: "Conversions Run", icon: FileCode2, color: "text-purple-600 bg-purple-50" },
  { key: "totalRevenue", label: "Total Revenue", icon: Banknote, color: "text-emerald-600 bg-emerald-50" },
];

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getActivity(),
        ]);
        setStats(statsRes.stats);
        setCharts(statsRes.charts);
        setActivity(activityRes.activity);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</p>;
  }

  const meetingsChartData = (charts?.meetingsPerDay || []).map((d) => ({ ...d, label: formatDay(d.date) }));
  const conversionsChartData = (charts?.conversionsPerDay || []).map((d) => ({ ...d, label: formatDay(d.date) }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of users, meetings, and conversions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats
                ? key === "totalRevenue"
                  ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(Number(stats[key]) || 0)
                  : stats[key]
                : 0}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Meetings (last 14 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={meetingsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Conversions (last 14 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400">No recent activity.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700">{item.message}</p>
                  <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
