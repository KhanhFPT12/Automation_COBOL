import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save, UserCircle2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAppStore } from "../../store";
import type { AdminUser, ConversionLogEntry, Meeting } from "../../types";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition";

export function UserDetailPage() {
  const { adminSelectedUserId, setActivePage } = useAppStore();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionLogEntry[]>([]);
  const [meetingHistory, setMeetingHistory] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", companyName: "", phone: "", credits: "" });

  useEffect(() => {
    if (!adminSelectedUserId) {
      setActivePage("admin-users");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await adminApi.getUserDetail(adminSelectedUserId);
        setUser(data.user);
        setConversionHistory(data.conversionHistory);
        setMeetingHistory(data.meetingHistory);
        setForm({
          fullName: data.user.fullName || "",
          companyName: data.user.companyName || "",
          phone: data.user.phone || "",
          credits: data.user.credits != null ? String(data.user.credits) : "",
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load user.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSelectedUserId]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateUser(user._id, {
        fullName: form.fullName,
        companyName: form.companyName,
        phone: form.phone,
        credits: form.credits === "" ? null : Number(form.credits),
      });
      setUser(updated.user);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading user...
      </div>
    );
  }

  if (error || !user) {
    return <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error || "User not found."}</p>;
  }

  return (
    <div className="space-y-6">
      <button onClick={() => setActivePage("admin-users")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition">
        <ArrowLeft className="h-4 w-4" /> Back to User Management
      </button>

      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <UserCircle2 className="h-16 w-16 text-slate-300" />
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{user.fullName || user.companyName}</h1>
          <p className="text-slate-500 text-sm">{user.email || user.businessEmail}</p>
        </div>
      </div>

      {/* Personal information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Full Name</label>
            <input className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Company</label>
            <input className={inputClass} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Credits Remaining</label>
            <input className={inputClass} type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {/* Conversion history */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Conversion History ({conversionHistory.length})</h3>
        {conversionHistory.length === 0 ? (
          <p className="text-sm text-slate-400">No conversions yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {conversionHistory.map((c) => (
              <li key={c._id} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2">
                <span className="text-slate-700">
                  {c.fileType.toUpperCase()} · {c.screenCount} screen(s) · {c.success ? "Success" : "Failed"}
                </span>
                <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Meeting history */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Meeting History ({meetingHistory.length})</h3>
        {meetingHistory.length === 0 ? (
          <p className="text-sm text-slate-400">No meetings yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {meetingHistory.map((m) => (
              <li key={m._id} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2">
                <span className="text-slate-700">{m.topic} — {m.status}</span>
                <span className="text-xs text-slate-400">{new Date(m.preferredDate).toLocaleDateString()} {m.preferredTime}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payment history (no billing system yet) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Payment History</h3>
        <p className="text-sm text-slate-400">No billing system connected yet.</p>
      </div>
    </div>
  );
}
