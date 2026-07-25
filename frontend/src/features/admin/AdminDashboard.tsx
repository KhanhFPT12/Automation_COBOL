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
  ArrowUpRight,
  Activity,
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
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-inset ring-sky-100">
            <Activity className="h-3 w-3" /> Live overview
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950">Dashboard</h1>
          <p className="mt-1.5 text-sm text-slate-500">Your platform performance at a glance.</p>
        </div>
        <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
          Updated {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-200 transition group-hover:text-sky-400" />
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {stats
                ? key === "totalRevenue"
                  ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(Number(stats[key]) || 0)
                  : stats[key]
                : 0}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Meeting activity</h3><p className="mt-0.5 text-[11px] text-slate-400">Last 14 days</p></div><span className="h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-50" /></div>
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
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Conversion volume</h3><p className="mt-0.5 text-[11px] text-slate-400">Last 14 days</p></div><span className="h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-purple-50" /></div>
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
        <div className="mb-5 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Recent activity</h3><p className="mt-0.5 text-[11px] text-slate-400">Latest changes across the platform</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live</span></div>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400">No recent activity.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl px-2 py-2 text-sm transition hover:bg-slate-50">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-50"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" /></span>
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
