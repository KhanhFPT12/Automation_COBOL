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
import { useAppStore } from "../../store";
import { adminApi } from "../../services/adminApi";
import type { ActivePage, ActivityItem, DashboardCharts, DashboardStats } from "../../types";

const STAT_CARDS: {
  key: keyof DashboardStats;
  label: string;
  icon: typeof Users;
  color: string;
  page: ActivePage;
}[] = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-sky-600 bg-sky-50 ring-1 ring-sky-200/80", page: "admin-users" },
  { key: "totalMeetings", label: "Total Meetings", icon: CalendarClock, color: "text-indigo-600 bg-indigo-50 ring-1 ring-indigo-200/80", page: "admin-meetings" },
  { key: "pendingMeetings", label: "Pending Approval", icon: Hourglass, color: "text-amber-700 bg-amber-50 ring-1 ring-amber-200/80", page: "admin-meetings" },
  { key: "approvedMeetings", label: "Approved Meetings", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/80", page: "admin-meetings" },
  { key: "rejectedMeetings", label: "Rejected Meetings", icon: XCircle, color: "text-rose-700 bg-rose-50 ring-1 ring-rose-200/80", page: "admin-meetings" },
  { key: "totalConversions", label: "Conversions Run", icon: FileCode2, color: "text-purple-700 bg-purple-50 ring-1 ring-purple-200/80", page: "admin-conversions" },
  { key: "totalRevenue", label: "Total Revenue", icon: Banknote, color: "text-emerald-800 bg-emerald-50 ring-1 ring-emerald-200/80", page: "admin-invoices" },
];

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unitName?: string;
}

function CustomChartTooltip({ active, payload, label, unitName = "records" }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-slate-950/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md border border-slate-800 text-white text-xs">
        <p className="font-medium text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-black text-sky-400">
          {payload[0].value} <span className="text-[11px] font-normal text-slate-300">{unitName}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function AdminDashboard() {
  const { setActivePage } = useAppStore();
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
      <div className="flex items-center justify-center py-24 text-slate-400 font-medium">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-sky-600" /> Loading dashboard overview...
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm font-medium">{error}</p>;
  }

  const meetingsChartData = (charts?.meetingsPerDay || []).map((d) => ({ ...d, label: formatDay(d.date) }));
  const conversionsChartData = (charts?.conversionsPerDay || []).map((d) => ({ ...d, label: formatDay(d.date) }));

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-700 ring-1 ring-inset ring-sky-200/80">
            <Activity className="h-3.5 w-3.5" /> Live overview
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Your platform performance at a glance.</p>
        </div>
        <p className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          Updated {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, page }) => (
          <button
            key={key}
            onClick={() => setActivePage(page)}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 hover:ring-2 hover:ring-sky-100/70 p-5 sm:p-6 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {stats
                  ? key === "totalRevenue"
                    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(Number(stats[key]) || 0)
                    : stats[key]
                  : 0}
              </p>
              <p className="text-xs font-bold text-slate-500 mt-1.5">{label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Meeting activity</h3>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Daily bookings (Last 14 days)</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-50" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={meetingsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.7} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" allowDecimals={false} />
              <Tooltip content={<CustomChartTooltip unitName="meetings" />} />
              <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2.5} activeDot={{ r: 6, fill: "#0284c7" }} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conversion volume</h3>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Daily file conversions (Last 14 days)</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-purple-50" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.7} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" allowDecimals={false} />
              <Tooltip content={<CustomChartTooltip unitName="conversions" />} />
              <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">Latest changes across the platform</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">Live</span>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No recent activity logged.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50 border border-transparent hover:border-slate-100">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-50"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium">{item.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
