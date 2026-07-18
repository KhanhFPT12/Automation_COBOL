import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import type { ConversionLogEntry, Pagination } from "../../types";

const FILE_TYPE_FILTERS = ["all", "bms", "dspf"] as const;

export function ConversionHistoryPage() {
  const [conversions, setConversions] = useState<ConversionLogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [fileType, setFileType] = useState<(typeof FILE_TYPE_FILTERS)[number]>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { conversions, pagination } = await adminApi.listConversions({ fileType, page, limit: 15 });
        setConversions(conversions);
        setPagination(pagination);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load conversion history.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fileType, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Conversion History</h1>
        <p className="text-slate-500 text-sm mt-1">{pagination?.total ?? 0} conversion jobs recorded.</p>
      </div>

      <div className="flex gap-2">
        {FILE_TYPE_FILTERS.map((ft) => (
          <button
            key={ft}
            onClick={() => { setFileType(ft); setPage(1); }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${fileType === ft ? "bg-sky-600 text-white border-sky-600" : "text-slate-500 border-slate-200 hover:bg-slate-50"}`}
          >
            {ft === "all" ? "All" : ft.toUpperCase()}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</p>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Screens</th>
                <th className="px-5 py-3 font-semibold">Result</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading...</td></tr>
              ) : conversions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">No conversions recorded yet.</td></tr>
              ) : (
                conversions.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 text-slate-700">
                      {c.user ? (c.user.fullName || c.user.email || c.user.companyName) : <span className="text-slate-400 italic">Anonymous</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-mono text-xs uppercase">{c.fileType}</td>
                    <td className="px-5 py-3 text-slate-600">{c.screenCount}</td>
                    <td className="px-5 py-3">
                      {c.success ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Success</span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 text-xs font-semibold" title={c.errorMessage}><XCircle className="h-3.5 w-3.5" /> Failed</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(c.createdAt).toLocaleString()}</td>
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
