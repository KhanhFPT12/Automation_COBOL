import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { adminApi } from "../../services/adminApi";
import type { DashboardCharts, DashboardStats } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Approved: "#10b981",
  Rejected: "#f43f5e",
  Cancelled: "#94a3b8",
  Completed: "#0ea5e9",
};

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { stats, charts } = await adminApi.getStats();
        setStats(stats);
        setCharts(charts);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading reports...
      </div>
    );
  }

  if (error || !stats || !charts) {
    return <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error || "No data."}</p>;
  }

  const meetingStatusData = [
    { name: "Pending", value: stats.pendingMeetings },
    { name: "Approved", value: stats.approvedMeetings },
    { name: "Rejected", value: stats.rejectedMeetings },
    { name: "Cancelled", value: stats.cancelledMeetings },
    { name: "Completed", value: stats.completedMeetings },
  ].filter((d) => d.value > 0);

  const conversionsData = charts.conversionsPerDay.map((d) => ({ ...d, label: formatDay(d.date) }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Aggregate breakdown of meetings and conversions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Meeting Status Distribution</h3>
          {meetingStatusData.length === 0 ? (
            <p className="text-sm text-slate-400 py-16 text-center">No meetings yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={meetingStatusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {meetingStatusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Conversion Volume (14 days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={conversionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers },
          { label: "Total Meetings", value: stats.totalMeetings },
          { label: "Total Conversions", value: stats.totalConversions },
          { label: "Approval Rate", value: stats.totalMeetings ? `${Math.round((stats.approvedMeetings / stats.totalMeetings) * 100)}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
            <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
