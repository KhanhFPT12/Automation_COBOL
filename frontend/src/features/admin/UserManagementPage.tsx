import { useEffect, useState } from "react";
import { Search, Loader2, Lock, Unlock, Trash2, UserCircle2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAppStore } from "../../store";
import type { AdminUser, Pagination } from "../../types";

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  ENTERPRISE_ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200",
  USER: "bg-slate-100 text-slate-600 border-slate-200",
};

export function UserManagementPage() {
  const { setActivePage, setAdminSelectedUserId } = useAppStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { users, pagination } = await adminApi.listUsers({ search, page, limit: 10 });
      setUsers(users);
      setPagination(pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const openDetail = (id: string) => {
    setAdminSelectedUserId(id);
    setActivePage("admin-user-detail");
  };

  const toggleLock = async (user: AdminUser) => {
    setBusyId(user._id);
    try {
      if (user.isActive) await adminApi.lockUser(user._id);
      else await adminApi.unlockUser(user._id);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (user: AdminUser) => {
    if (!confirm(`Delete account "${user.fullName || user.companyName || user.email}"? This cannot be undone.`)) return;
    setBusyId(user._id);
    try {
      await adminApi.deleteUser(user._id);
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
          <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">{pagination?.total ?? 0} registered accounts.</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 w-64"
            />
          </div>
          <button type="submit" className="text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition">
            Search
          </button>
        </form>
      </div>

      {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</p>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold">Converts</th>
                <th className="px-5 py-3 font-semibold">Credits</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <button onClick={() => openDetail(u._id)} className="flex items-center gap-2.5 text-left">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <UserCircle2 className="h-8 w-8 text-slate-300" />
                        )}
                        <span>
                          <span className="block font-semibold text-slate-800 hover:text-sky-600">{u.fullName || u.companyName || "—"}</span>
                          <span className="block text-xs text-slate-400">{u.email || u.businessEmail}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{u.companyName || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {u.isActive ? "Active" : "Locked"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-slate-600">{u.convertCount}</td>
                    <td className="px-5 py-3 text-slate-600">{u.credits ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={busyId === u._id}
                          onClick={() => toggleLock(u)}
                          title={u.isActive ? "Lock account" : "Unlock account"}
                          className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition disabled:opacity-40"
                        >
                          {u.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          disabled={busyId === u._id}
                          onClick={() => removeUser(u)}
                          title="Delete account"
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${p === page ? "bg-sky-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
