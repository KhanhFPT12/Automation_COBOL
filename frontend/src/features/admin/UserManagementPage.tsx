import { useEffect, useState, useMemo } from "react";
import { 
  Search, Loader2, Lock, Unlock, Trash2, UserPlus, RefreshCcw,
  Users, ShieldCheck, Building2, Cpu, CheckCircle2, AlertCircle, X,
  ExternalLink, Mail, Phone, Calendar, ArrowUpRight, Shield, ChevronLeft, ChevronRight
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAppStore } from "../../store";
import type { AdminUser, Pagination } from "../../types";

const ROLE_BADGE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  ADMIN: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Super Admin" },
  ENTERPRISE_ADMIN: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", label: "Enterprise Admin" },
  USER: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", label: "Member User" },
};

const ACCOUNT_TYPE_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  ENTERPRISE: { bg: "bg-gradient-to-r from-amber-50 to-orange-50", text: "text-amber-700", border: "border-amber-200" },
  INDIVIDUAL: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
};

export function UserManagementPage() {
  const { setActivePage, setAdminSelectedUserId } = useAppStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Inspector Drawer & Modal States
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    accountType: "INDIVIDUAL" as "INDIVIDUAL" | "ENTERPRISE",
    role: "USER" as "USER" | "ENTERPRISE_ADMIN" | "ADMIN",
    password: "",
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState("");

  const load = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const { users, pagination } = await adminApi.listUsers({ search, page, limit });
      setUsers(users);
      setPagination(pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users list.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  // Client-side filtering for fast interactive view
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Status filter
      if (filterStatus === "active" && !u.isActive) return false;
      if (filterStatus === "locked" && u.isActive) return false;

      // Role filter
      if (filterRole === "ADMIN" && u.role !== "ADMIN" && u.role !== "ENTERPRISE_ADMIN") return false;
      if (filterRole === "ENTERPRISE" && u.accountType !== "ENTERPRISE") return false;
      if (filterRole === "USER" && u.role !== "USER") return false;

      return true;
    });
  }, [users, filterStatus, filterRole]);

  // Derived KPI Stats
  const stats = useMemo(() => {
    const total = pagination?.total || users.length;
    const active = users.filter((u) => u.isActive).length;
    const locked = users.filter((u) => !u.isActive).length;
    const enterprise = users.filter((u) => u.accountType === "ENTERPRISE").length;
    const totalConverts = users.reduce((acc, curr) => acc + (curr.convertCount || 0), 0);

    return { total, active, locked, enterprise, totalConverts };
  }, [users, pagination]);

  const openDetail = (id: string) => {
    setAdminSelectedUserId(id);
    setActivePage("admin-user-detail");
  };

  const toggleLock = async (user: AdminUser) => {
    setBusyId(user._id);
    try {
      if (user.isActive) await adminApi.lockUser(user._id);
      else await adminApi.unlockUser(user._id);
      await load(true);
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser({ ...selectedUser, isActive: !selectedUser.isActive });
      }
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
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser(null);
      }
      await load(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email.trim() || !newUserForm.fullName.trim()) {
      setCreateUserError("Full name and email are required.");
      return;
    }

    setIsCreatingUser(true);
    setCreateUserError("");

    try {
      // Simulate/call user provisioning API
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("alsm_token")}`,
        },
        body: JSON.stringify(newUserForm),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to create user account.");
      }

      setShowAddUserModal(false);
      setNewUserForm({
        fullName: "",
        email: "",
        accountType: "INDIVIDUAL",
        role: "USER",
        password: "",
      });
      await load(true);
    } catch (err: unknown) {
      setCreateUserError(err instanceof Error ? err.message : "Error provisioning user account.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-2xl text-white shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
              <span className="text-xs font-semibold text-slate-400">
                {stats.total} total registered accounts across all tiers
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-xs max-w-xl leading-relaxed mt-2">
            Manage user identity profiles, role privileges, account suspension states, and conversion activity limits across the ALSM platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button 
            onClick={() => load(true)} 
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accounts</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.total}</h4>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Platform Users</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Users</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.active}</h4>
            <p className="text-[10px] font-semibold text-emerald-600 mt-1">
              {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% active` : "100%"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enterprise Tier</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.enterprise}</h4>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Org & Corporate Accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Conversions</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.totalConverts}</h4>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Processed Jobs</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Status & Role Segment Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "active" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus("locked")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "locked" ? "bg-white text-rose-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Locked
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterRole("all")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setFilterRole("ENTERPRISE")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === "ENTERPRISE" ? "bg-white text-amber-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Enterprise
            </button>
            <button
              onClick={() => setFilterRole("ADMIN")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === "ADMIN" ? "bg-white text-purple-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </form>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Users Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[420px]">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 rounded-tl-3xl">User Profile</th>
                <th className="px-6 py-4">Account Type</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Conversions</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !isRefreshing ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-3.5 w-36 bg-slate-200 rounded-md"></div>
                          <div className="h-2.5 w-28 bg-slate-100 rounded-md"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-5 w-14 bg-slate-200 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded-md"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded-md"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-slate-200 rounded-xl inline-block"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 bg-slate-50/20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="p-4 bg-white rounded-full border border-slate-100 shadow-xs mb-3">
                        <Users className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No Users Found</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter options.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleStyle = ROLE_BADGE[u.role] || ROLE_BADGE.USER;
                  const accountTypeStyle = ACCOUNT_TYPE_BADGE[u.accountType] || ACCOUNT_TYPE_BADGE.INDIVIDUAL;
                  const primaryName = u.fullName || u.companyName || u.email?.split("@")[0] || "User Account";
                  const displayEmail = u.email || u.businessEmail || "No Email";
                  const initials = primaryName.substring(0, 2).toUpperCase();

                  return (
                    <tr 
                      key={u._id} 
                      onClick={() => {
                        setSelectedUser(u);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:bg-sky-50/40 transition-colors group cursor-pointer"
                    >
                      {/* User Profile Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs border-2 border-white">
                              {initials}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm hover:text-sky-600 transition-colors leading-snug">
                              {primaryName}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mt-0.5">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <span>{displayEmail}</span>
                              {u.isEmailVerified && (
                                <span title="Verified Email">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Account Type */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${accountTypeStyle.bg} ${accountTypeStyle.text} ${accountTypeStyle.border}`}>
                          {u.accountType === "ENTERPRISE" && <Building2 className="h-3 w-3" />}
                          {u.accountType || "INDIVIDUAL"}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                          {u.role === "ADMIN" && <Shield className="h-3 w-3 text-purple-600" />}
                          {roleStyle.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-bold">
                            <Lock className="h-3 w-3" />
                            Locked
                          </span>
                        )}
                      </td>

                      {/* Conversion Count */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-800">{u.convertCount || 0}</span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Jobs</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openDetail(u._id)}
                            title="Open Full Detail Page"
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>

                          <button
                            disabled={busyId === u._id}
                            onClick={() => toggleLock(u)}
                            title={u.isActive ? "Lock Account" : "Unlock Account"}
                            className={`p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 ${
                              u.isActive
                                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                            }`}
                          >
                            {u.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>

                          <button
                            disabled={busyId === u._id}
                            onClick={() => removeUser(u)}
                            title="Delete Account"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Compact & Interactive Pagination Controls */}
        {pagination && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
              >
                <option value={5}>5 accounts</option>
                <option value={6}>6 accounts</option>
                <option value={8}>8 accounts</option>
                <option value={10}>10 accounts</option>
                <option value={15}>15 accounts</option>
              </select>

              <span className="text-xs text-slate-400 font-medium hidden sm:inline">|</span>

              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{Math.min((page - 1) * limit + 1, pagination.total)}</span> - <span className="font-bold text-slate-900">{Math.min(page * limit, pagination.total)}</span> of <span className="font-bold text-slate-900">{pagination.total}</span> accounts
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-[32px] px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    p === page ? "bg-[#0061FF] text-white shadow-2xs font-extrabold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition-all cursor-pointer"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── SLIDE-OVER USER INSPECTOR DRAWER ───────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-y-auto">
            
            {/* Drawer Header - Modern SaaS Light Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 via-sky-50/50 to-white text-slate-900 flex items-center justify-between border-b border-slate-200/90 border-t-4 border-t-[#0061FF]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0061FF] to-[#3B82F6] flex items-center justify-center text-white font-black text-base border-2 border-white shadow-md shadow-blue-500/20">
                  {(selectedUser.fullName || selectedUser.companyName || "U").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedUser.fullName || selectedUser.companyName || "User Identity"}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {selectedUser._id}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Account Badges Summary */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Account Status</p>
                  <div className="mt-1">
                    {selectedUser.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 className="h-4 w-4" /> Active & Operational
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                        <Lock className="h-4 w-4" /> Account Suspended
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase text-right">Tier</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-100 text-sky-700 uppercase mt-1">
                    {selectedUser.accountType || "INDIVIDUAL"}
                  </span>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Account Contact Details</h4>
                
                <div className="space-y-3 bg-white border border-slate-200/80 rounded-2xl p-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" /> Primary Email
                    </span>
                    <span className="font-bold text-slate-900">{selectedUser.email || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" /> Business Email
                    </span>
                    <span className="font-bold text-slate-900">{selectedUser.businessEmail || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" /> Phone
                    </span>
                    <span className="font-bold text-slate-900">{selectedUser.phone || "Not Provided"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" /> Organization
                    </span>
                    <span className="font-bold text-slate-900">{selectedUser.companyName || "Individual Account"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" /> Registered Date
                    </span>
                    <span className="font-bold text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Usage Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Usage & Quota Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-sky-600 uppercase">Conversion Jobs</p>
                    <p className="text-xl font-black text-sky-900 mt-1">{selectedUser.convertCount || 0}</p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">Available Credits</p>
                    <p className="text-xl font-black text-indigo-900 mt-1">{selectedUser.credits ?? "Unlimited"}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2">
              <button
                onClick={() => openDetail(selectedUser._id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Open Full Account Dashboard
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => toggleLock(selectedUser)}
                disabled={busyId === selectedUser._id}
                className={`w-full py-2.5 font-bold text-xs rounded-xl border transition-all cursor-pointer ${
                  selectedUser.isActive 
                    ? "bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
                    : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {selectedUser.isActive ? "Suspend / Lock Account" : "Reactivate Account"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── ADD NEW USER MODAL ─────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddUserModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Provision New User</h3>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {createUserError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {createUserError}
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. Nguyen Van A"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Tier</label>
                  <select
                    value={newUserForm.accountType}
                    onChange={(e) => setNewUserForm({ ...newUserForm, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Privilege</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                  >
                    <option value="USER">Member User</option>
                    <option value="ENTERPRISE_ADMIN">Enterprise Admin</option>
                    <option value="ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password (Optional)</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Leave blank for auto-generated password"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="flex items-center gap-2 px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {isCreatingUser && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Provision Account
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
