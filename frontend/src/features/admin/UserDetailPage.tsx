import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, UserCircle2, Mail, Building, Phone, Database, CheckCircle, XCircle, CreditCard, Activity, Calendar } from "lucide-react";
import { adminApi, type AdminSubscription } from "../../services/adminApi";
import { useAppStore } from "../../store";
import type { AdminUser, ConversionLogEntry, Meeting } from "../../types";

export function UserDetailPage() {
  const { adminSelectedUserId, setActivePage } = useAppStore();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionLogEntry[]>([]);
  const [meetingHistory, setMeetingHistory] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<AdminSubscription | null>(null);
  const [reactivating, setReactivating] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

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
        setSubscription(data.subscription);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load user detail.");
      } finally {
        setLoading(false);
      }
    })();
  }, [adminSelectedUserId, setActivePage]);

  const reactivateSubscription = async () => {
    if (!user) return;
    setReactivating(true);
    setSubscriptionMessage("");
    try {
      const response = await adminApi.reactivateSubscription(user._id);
      setSubscription(response.subscription);
      setSubscriptionMessage(response.message);
    } catch (err) {
      setSubscriptionMessage(err instanceof Error ? err.message : "Failed to reactivate subscription.");
    } finally {
      setReactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-sky-500" />
        <p className="font-semibold text-slate-600">Retrieving user profile...</p>
        <p className="text-xs mt-2 max-w-sm text-center">Please wait while we gather all historical data, conversion logs, and associated records for this user.</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <XCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md text-center">{error || "The requested user profile does not exist or has been removed from the system."}</p>
        <button onClick={() => setActivePage("admin-users")} className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition">
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <button onClick={() => setActivePage("admin-users")} className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors">
        <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-sky-200 group-hover:bg-sky-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to User Management
      </button>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-50 to-transparent rounded-bl-full opacity-60 pointer-events-none"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-20 w-20 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-slate-100" />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center shadow-sm border-2 border-white ring-1 ring-slate-100">
                <UserCircle2 className="h-10 w-10 text-slate-400" />
              </div>
            )}
            <div className={`absolute -bottom-2 -right-2 h-5 w-5 rounded-full border-2 border-white ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user.fullName || user.companyName || "Unknown User"}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email || user.businessEmail}</span>
              {user.companyName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> {user.companyName}</span>
                </>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">Role: {user.role}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {user.isActive ? 'Active Account' : 'Account Suspended'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Read-Only Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-sky-500" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Full Name</p>
                <p className="text-sm font-medium text-slate-800">{user.fullName || "—"}</p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Company</p>
                <p className="text-sm font-medium text-slate-800">{user.companyName || "—"}</p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-0.5 flex items-center gap-1.5"><Phone className="h-3 w-3" /> Phone Number</p>
                <p className="text-sm font-medium text-slate-800">{user.phone || "—"}</p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5 flex items-center gap-1.5"><Database className="h-3 w-3" /> Available Credits</p>
                  <p className="text-sm font-bold text-sky-600">{user.credits != null ? user.credits.toLocaleString() : "Unlimited"}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Database className="h-4 w-4 text-sky-600" />
                </div>
              </div>
            </div>
            <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
              <Activity className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Notice: Administrative roles are restricted to read-only mode for security and compliance purposes. To edit, the user must update their own profile.
              </p>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-500" /> Subscription Status
            </h3>
            {!subscription ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-xl">
                <CreditCard className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500">No active subscription</p>
                <p className="text-xs text-slate-400 mt-1">This user is currently on the free tier.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 relative">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Current Plan</p>
                  <p className="text-xl font-black text-indigo-900">{subscription.planName}</p>
                  <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${subscription.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {subscription.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Renewal Date</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Billing Cycle</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5 capitalize">{subscription.status}</p>
                  </div>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5" /> Cancellation Scheduled</p>
                    <p className="text-xs text-rose-600 mt-1">Will cancel on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                    {subscription.cancellationReason && <p className="text-xs text-rose-600/80 mt-1 italic">"{subscription.cancellationReason}"</p>}
                  </div>
                )}
                
                {subscriptionMessage && <p className="text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-lg">{subscriptionMessage}</p>}
                
                {subscription.status === "active" && subscription.cancelAtPeriodEnd && new Date(subscription.currentPeriodEnd) > new Date() && (
                  <button 
                    disabled={reactivating} 
                    onClick={() => void reactivateSubscription()} 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {reactivating && <Loader2 className="h-4 w-4 animate-spin" />}
                    {reactivating ? "Processing..." : "Reactivate Subscription"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Histories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversion History Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" /> 
                Recent Conversions
                <span className="bg-slate-200 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-2">{conversionHistory.length}</span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {conversionHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Database className="h-12 w-12 text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-600">No conversions recorded</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">This user has not executed any COBOL file conversions yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversionHistory.map((c) => (
                    <div key={c._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black text-xs ${c.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.fileType.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Converted {c.screenCount} Screen{c.screenCount !== 1 && 's'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {c.success ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-rose-500" />}
                            {c.success ? "Successfully generated" : "Conversion encountered an error"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] font-medium text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meeting History Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" /> 
                Scheduled Meetings
                <span className="bg-slate-200 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-2">{meetingHistory.length}</span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {meetingHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Calendar className="h-12 w-12 text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-600">No scheduled meetings</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[250px]">The user has not requested any consultation meetings with support.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {meetingHistory.map((m) => {
                    const statusColors: Record<string, string> = {
                      approved: "bg-emerald-100 text-emerald-700",
                      pending: "bg-amber-100 text-amber-700",
                      rejected: "bg-rose-100 text-rose-700"
                    };
                    return (
                      <div key={m._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold`}>
                            <Calendar className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{m.topic}</p>
                            <p className="text-xs text-slate-500 font-medium">{new Date(m.preferredDate).toLocaleDateString()} at {m.preferredTime}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusColors[m.status] || 'bg-slate-100 text-slate-600'}`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
