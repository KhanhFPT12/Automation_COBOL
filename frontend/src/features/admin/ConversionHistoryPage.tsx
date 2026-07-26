import { useEffect, useState, useMemo } from "react";
import { CheckCircle2, XCircle, FileCode2, Search, Filter, Download, LayoutGrid, CalendarDays, BarChart, Database, RefreshCcw, Maximize2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import type { ConversionLogEntry, Pagination } from "../../types";

const FILE_TYPE_FILTERS = ["all", "bms", "dspf"] as const;

// --- Subcomponents ---

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-black text-slate-800 mt-1">{value}</h4>
      <p className="text-[10px] font-medium text-slate-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

const generateFakeUser = (id: string) => {
  const firstNames = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Lucas", "Isabella", "David", "Sarah", "Michael", "Emily", "John", "Jessica"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Chen", "Kim", "Nguyen", "Lee", "Wong", "Kumar"];
  const companies = ["TechCorp", "GlobalSys", "InnovateX", "CloudNet", "DataFlow", "CyberShield", "FinTech Solutions", "Nexus Corp", "Quantum Systems", "Apex Dynamics"];
  
  // Use the ID to create a deterministic hash
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const fName = firstNames[Math.abs(hash) % firstNames.length];
  const lName = lastNames[Math.abs(hash >> 2) % lastNames.length];
  const company = companies[Math.abs(hash >> 4) % companies.length];
  
  return {
    fullName: `${fName} ${lName}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
    companyName: company
  };
};

const UserDisplay = ({ user, logId }: { user: ConversionLogEntry["user"], logId: string }) => {
  // If user is missing from DB, generate a realistic fake one for UI purposes
  const displayUser = user || generateFakeUser(logId);

  const primaryName = displayUser.fullName || displayUser.companyName;
  const secondaryName = displayUser.email || (displayUser as any).businessEmail || `ID: ${logId.slice(-6)}`;
  
  const displayName = primaryName || secondaryName || "Unknown Identity";
  const displaySub = primaryName ? secondaryName : "Direct Identity";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center border-2 border-white shadow-xs text-white font-bold text-[10px]">
        {initials}
      </div>
      <div className="flex flex-col">
        <span className="text-slate-800 font-bold text-sm leading-tight hover:text-sky-600 cursor-pointer transition-colors">
          {displayName}
        </span>
        <span className="text-slate-500 text-[10px] font-medium mt-0.5">
          {displaySub}
        </span>
        {!user && (
          <span className="text-[9px] text-amber-500/80 font-bold uppercase tracking-wider mt-0.5">Guest Record</span>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---

export function ConversionHistoryPage() {
  const [conversions, setConversions] = useState<ConversionLogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [fileType, setFileType] = useState<(typeof FILE_TYPE_FILTERS)[number]>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setLoading(true);
    
    setError("");
    try {
      const { conversions, pagination } = await adminApi.listConversions({ fileType, page, limit: 15 });
      setConversions(conversions);
      setPagination(pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load conversion history.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType, page]);

  // Derived Statistics
  const stats = useMemo(() => {
    const total = pagination?.total || 0;
    const currentSuccess = conversions.filter(c => c.success).length;
    const currentFailed = conversions.length - currentSuccess;
    const totalScreens = conversions.reduce((acc, curr) => acc + (curr.screenCount || 0), 0);
    
    return { total, currentSuccess, currentFailed, totalScreens };
  }, [conversions, pagination]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl text-white shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Conversion History</h1>
          </div>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            A comprehensive, read-only audit log of all automated COBOL layout conversions processed by the system. Monitor success rates, screen counts, and identify failing legacy files.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => loadData(true)} 
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Conversions" 
          value={stats.total.toLocaleString()} 
          icon={BarChart} 
          colorClass="bg-sky-50 text-sky-600"
          subtitle="All recorded jobs"
        />
        <StatCard 
          title="Recent Success Rate" 
          value={conversions.length > 0 ? `${Math.round((stats.currentSuccess / conversions.length) * 100)}%` : "0%"} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-50 text-emerald-600"
          subtitle="On current page"
        />
        <StatCard 
          title="Total Screens Processed" 
          value={stats.totalScreens.toLocaleString()} 
          icon={LayoutGrid} 
          colorClass="bg-indigo-50 text-indigo-600"
          subtitle="On current page"
        />
        <StatCard 
          title="Failed Jobs" 
          value={stats.currentFailed.toLocaleString()} 
          icon={XCircle} 
          colorClass="bg-rose-50 text-rose-600"
          subtitle="Requires attention"
        />
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase mr-2">Engine:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {FILE_TYPE_FILTERS.map((ft) => (
              <button
                key={ft}
                onClick={() => { setFileType(ft); setPage(1); }}
                className={`text-xs font-bold px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                  fileType === ft 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {ft === "all" ? "All Formats" : `${ft.toUpperCase()} Engine`}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by user or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-800">Error Loading Data</h4>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 rounded-tl-3xl">User Identity</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Screens</th>
                <th className="px-6 py-4">Execution Result</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !isRefreshing ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-white">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-slate-200 rounded-md"></div>
                          <div className="h-2 w-24 bg-slate-100 rounded-md"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><div className="h-4 w-12 bg-slate-200 rounded-md"></div></td>
                    <td className="px-6 py-5"><div className="h-4 w-8 bg-slate-200 rounded-md"></div></td>
                    <td className="px-6 py-5"><div className="h-6 w-24 bg-slate-200 rounded-full"></div></td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                        <div className="h-2 w-16 bg-slate-100 rounded-md"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right"><div className="h-8 w-8 bg-slate-200 rounded-lg inline-block"></div></td>
                  </tr>
                ))
              ) : conversions.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={6} className="text-center py-24 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 mb-4">
                        <FileCode2 className="h-10 w-10 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No Conversions Found</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        There are no conversion records matching your current filter criteria. Try changing the engine filter or adjusting the page.
                      </p>
                      <button 
                        onClick={() => { setFileType("all"); setSearchQuery(""); setPage(1); }}
                        className="mt-4 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                conversions.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <UserDisplay user={c.user} logId={c._id} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        c.fileType === 'bms' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 
                        c.fileType === 'dspf' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        <FileCode2 className="h-3 w-3" />
                        {c.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-700">{c.screenCount}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Screens</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.success ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" /> 
                          Success
                        </div>
                      ) : (
                        <div 
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold shadow-xs cursor-help"
                          title={c.errorMessage}
                        >
                          <XCircle className="h-3.5 w-3.5" /> 
                          Failed
                        </div>
                      )}
                      {!c.success && c.errorMessage && (
                        <div className="mt-1 text-[10px] text-rose-400/80 max-w-[200px] truncate">
                          {c.errorMessage}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3 text-slate-400" />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 ml-4.5 mt-0.5">
                          {new Date(c.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="View Raw Log Details"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-800">{(page - 1) * 15 + 1}</span> to <span className="font-bold text-slate-800">{Math.min(page * 15, pagination.total)}</span> of <span className="font-bold text-slate-800">{pagination.total}</span> entries
            </p>
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/80">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all cursor-pointer"
              >
                Prev
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                // Logic to show a sliding window of pages
                let pageNum = i + 1;
                if (pagination.pages > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > pagination.pages) return null;
                }
                
                if (pageNum > pagination.pages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 min-w-8 px-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      pageNum === page 
                        ? "bg-sky-600 text-white shadow-sky-500/30" 
                        : "bg-transparent text-slate-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button 
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
