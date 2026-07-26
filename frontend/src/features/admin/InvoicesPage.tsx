import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Search, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { adminApi, type AdminInvoice } from "../../services/adminApi";

const STATUS_FILTERS = ["all", "open", "paid", "void", "uncollectible"] as const;

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  
  // Manual payment confirm states
  const [confirmingInvoice, setConfirmingInvoice] = useState<AdminInvoice | null>(null);
  const [submittingConfirm, setSubmittingConfirm] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.getInvoices();
      if (response.success) {
        setInvoices(response.data);
      } else {
        setError("Failed to load invoice list.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while loading the invoice list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvoices();
  }, []);

  const handleConfirmPayment = async () => {
    if (!confirmingInvoice) return;
    setSubmittingConfirm(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await adminApi.confirmInvoicePayment(confirmingInvoice.id);
      if (response.success) {
        setSuccessMessage(`Manual payment confirmed for invoice ${confirmingInvoice.invoiceNumber} successfully.`);
        setConfirmingInvoice(null);
        await fetchInvoices();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(response.message || "Manual payment confirmation failed.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during manual payment confirmation.");
    } finally {
      setSubmittingConfirm(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.paymentReference && inv.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AdminInvoice["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" /> Paid
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-sky-100">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Pending Transfer
          </span>
        );
      case "void":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
            <XCircle className="h-3.5 w-3.5" /> Cancelled/Expired
          </span>
        );
      case "uncollectible":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-100">
            <XCircle className="h-3.5 w-3.5" /> Uncollectible
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
            <HelpCircle className="h-3.5 w-3.5" /> Draft
          </span>
        );
    }
  };

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === "VND" ? "vi-VN" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-sky-800 to-slate-900 tracking-tight">
          Invoice & Transaction
        </h1>
        <p className="text-slate-500 text-sm font-medium">Manage and review all customer service upgrades and payments.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50/80 backdrop-blur-sm border border-rose-200/50 text-rose-700 text-sm rounded-2xl shadow-sm animate-in fade-in zoom-in-95">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 text-emerald-700 text-sm rounded-2xl shadow-sm flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/60 shadow-sm">
        {/* Status filters - Segmented Control Style */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 ${
                filterStatus === s
                  ? "bg-white text-sky-700 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {s === "all"
                ? "All Invoices"
                : s === "open"
                ? "Pending"
                : s === "paid"
                ? "Paid"
                : s === "void"
                ? "Cancelled"
                : "Uncollectible"}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-96 group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, Email, Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-5 rounded-tl-[2rem]">Invoice ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Payment Ref</th>
                <th className="px-6 py-5">Plan</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right rounded-tr-[2rem]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                      <span className="font-medium text-slate-500">Loading your data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No invoices found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {inv.customerName && inv.customerName !== "N/A" && inv.customerName !== "Unknown"
                          ? inv.customerName
                          : (inv.customerEmail && inv.customerEmail !== "Unknown" ? inv.customerEmail.split("@")[0] : "Customer")}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{inv.customerEmail}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">{inv.customerName || "N/A"}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{inv.customerEmail}</div>
                    </td>
                    <td className="px-6 py-5">
                      {inv.paymentReference ? (
                        <span className="font-mono bg-sky-100/50 text-sky-700 font-bold px-2.5 py-1 rounded-md text-xs select-all border border-sky-200/50">
                          {inv.paymentReference}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-xs font-medium">No Ref</span>
                      )}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-600">
                      {inv.pendingPlanName}
                    </td>
                    <td className="px-6 py-5 font-black text-slate-900 tracking-tight">
                      {formatMoney(inv.total, inv.currency)}
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(inv.status)}</td>
                    <td className="px-6 py-5 text-xs text-slate-400 font-medium">
                      {new Date(inv.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      <div className="text-[10px] text-slate-300 mt-0.5">{new Date(inv.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute:'2-digit' })}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {inv.pdfUrl && (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 font-bold px-3 py-1.5 rounded-xl text-xs transition-all duration-200"
                          >
                            <FileText className="h-4 w-4" /> PDF
                          </a>
                        )}

                        {inv.status === "open" && (
                          <button
                            type="button"
                            onClick={() => setConfirmingInvoice(inv)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all duration-200 shadow-sm shadow-emerald-200"
                          >
                            Approve
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

      {/* Manual Payment Confirmation Modal */}
      {confirmingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmingInvoice(null)}></div>
          <div className="relative w-full max-w-md rounded-[2rem] bg-white/95 backdrop-blur-2xl p-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Payment</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Are you sure you want to manually approve this invoice?</p>
            
            <div className="bg-slate-50/80 backdrop-blur rounded-2xl p-5 border border-slate-200/60 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Invoice ID</span>
                <span className="font-black text-slate-900">{confirmingInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Customer</span>
                <span className="font-bold text-slate-800">{confirmingInvoice.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Plan</span>
                <span className="font-bold text-sky-600">{confirmingInvoice.pendingPlanName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-black text-slate-900 text-base">{formatMoney(confirmingInvoice.total, confirmingInvoice.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Ref Code</span>
                <span className="font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                  {confirmingInvoice.paymentReference || "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-5 bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex gap-2">
              <HelpCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <p className="text-xs text-rose-700 font-medium leading-relaxed">
                This action is irreversible. The customer's plan will be upgraded immediately.
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                disabled={submittingConfirm}
                onClick={() => setConfirmingInvoice(null)}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingConfirm}
                onClick={() => void handleConfirmPayment()}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 disabled:opacity-50 transition-all"
              >
                {submittingConfirm && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
