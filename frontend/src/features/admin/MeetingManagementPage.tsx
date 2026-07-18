import { useEffect, useState } from "react";
import { Search, Loader2, CheckSquare, CheckCircle2, XCircle, Ban, CircleCheck, X } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import type { Meeting, MeetingDuration, MeetingStatus } from "../../types";

const STATUS_BADGE: Record<MeetingStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  Completed: "bg-sky-50 text-sky-700 border-sky-200",
};

const STATUS_FILTERS: (MeetingStatus | "all")[] = ["all", "Pending", "Approved", "Rejected", "Cancelled", "Completed"];

function ApproveModal({ meeting, onClose, onDone }: { meeting: Meeting; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    topic: meeting.topic,
    description: meeting.description,
    preferredDate: meeting.preferredDate.slice(0, 10),
    preferredTime: meeting.preferredTime,
    duration: meeting.duration,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await adminApi.approveMeeting(meeting._id, form);
      onDone();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve meeting.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Confirm & Approve Meeting</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Meeting Title</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Meeting Content</label>
            <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[70px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Date</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Time</label>
              <input type="time" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Duration (minutes)</label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) as MeetingDuration })}>
              {[30, 60, 90].map((d) => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={confirm} disabled={busy} className="flex items-center gap-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white px-4 py-2 rounded-lg transition">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
            Confirm & Create Google Meet
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({ meeting, onClose, onDone }: { meeting: Meeting; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    if (!reason.trim()) {
      setError("A rejection reason is required.");
      return;
    }
    setBusy(true);
    try {
      await adminApi.rejectMeeting(meeting._id, reason.trim());
      onDone();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reject meeting.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Reject Meeting</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Reason for rejection *</label>
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Requested time slot is unavailable"
        />
        {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-3">{error}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={confirm} disabled={busy} className="flex items-center gap-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white px-4 py-2 rounded-lg transition">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export function MeetingManagementPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [status, setStatus] = useState<MeetingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approveTarget, setApproveTarget] = useState<Meeting | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Meeting | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { meetings } = await adminApi.listMeetings({ status: status === "all" ? undefined : status, search: search || undefined, limit: 50 });
      setMeetings(meetings);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const runAction = async (id: string, action: "cancel" | "complete") => {
    setBusyId(id);
    try {
      if (action === "cancel") await adminApi.cancelMeeting(id);
      else await adminApi.completeMeeting(id);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Meeting Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage all meeting requests.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requester, email, topic..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 w-64"
            />
          </div>
          <button type="submit" className="text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition">Search</button>
        </form>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${status === s ? "bg-sky-600 text-white border-sky-600" : "text-slate-500 border-slate-200 hover:bg-slate-50"}`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</p>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Requester</th>
                <th className="px-5 py-3 font-semibold">Topic</th>
                <th className="px-5 py-3 font-semibold">Date / Time</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading...</td></tr>
              ) : meetings.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No meetings found.</td></tr>
              ) : (
                meetings.map((m) => (
                  <tr key={m._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <span className="block font-semibold text-slate-800">{m.fullName}</span>
                      <span className="block text-xs text-slate-400">{m.companyName || m.email}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 max-w-[220px] truncate">{m.topic}</td>
                    <td className="px-5 py-3 text-slate-600 text-xs">
                      {new Date(m.preferredDate).toLocaleDateString()} · {m.preferredTime} ({m.timeZone})
                    </td>
                    <td className="px-5 py-3 text-slate-600">{m.duration} min</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_BADGE[m.status]}`}>{m.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {m.status === "Pending" && (
                          <>
                            <button onClick={() => setApproveTarget(m)} title="Approve" className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => setRejectTarget(m)} title="Reject" className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {["Pending", "Approved"].includes(m.status) && (
                          <button disabled={busyId === m._id} onClick={() => runAction(m._id, "cancel")} title="Cancel" className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-40">
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        {m.status === "Approved" && (
                          <button disabled={busyId === m._id} onClick={() => runAction(m._id, "complete")} title="Mark completed" className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition disabled:opacity-40">
                            <CheckSquare className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {approveTarget && (
        <ApproveModal
          meeting={approveTarget}
          onClose={() => setApproveTarget(null)}
          onDone={() => { setApproveTarget(null); load(); }}
        />
      )}
      {rejectTarget && (
        <RejectModal
          meeting={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onDone={() => { setRejectTarget(null); load(); }}
        />
      )}
    </div>
  );
}
