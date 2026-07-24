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
        setError("Không thể tải danh sách hóa đơn.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải danh sách hóa đơn.");
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
        setSuccessMessage(`Đã xác nhận thanh toán thủ công cho hóa đơn ${confirmingInvoice.invoiceNumber} thành công.`);
        setConfirmingInvoice(null);
        await fetchInvoices();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(response.message || "Xác nhận thanh toán thất bại.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xác nhận thanh toán.");
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
            <CheckCircle2 className="h-3.5 w-3.5" /> Đã thanh toán
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-sky-100">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chờ chuyển khoản
          </span>
        );
      case "void":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
            <XCircle className="h-3.5 w-3.5" /> Đã hủy/Hết hạn
          </span>
        );
      case "uncollectible":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-100">
            <XCircle className="h-3.5 w-3.5" /> Thất thu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
            <HelpCircle className="h-3.5 w-3.5" /> Nháp
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Quản lý Hóa đơn & Giao dịch</h1>
        <p className="text-slate-500 text-sm mt-1">Danh sách các hóa đơn nâng cấp gói dịch vụ của khách hàng.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                filterStatus === s
                  ? "bg-sky-600 text-white border-sky-600"
                  : "text-slate-500 border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {s === "all"
                ? "Tất cả"
                : s === "open"
                ? "Chờ thanh toán"
                : s === "paid"
                ? "Đã thanh toán"
                : s === "void"
                ? "Đã hủy/Hết hạn"
                : "Thất thu"}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm theo Mã hóa đơn, Email, ND CK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
          />
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-4 font-semibold">Mã Hóa đơn</th>
                <th className="px-5 py-4 font-semibold">Khách hàng</th>
                <th className="px-5 py-4 font-semibold">Nội dung chuyển khoản</th>
                <th className="px-5 py-4 font-semibold">Gói đăng ký</th>
                <th className="px-5 py-4 font-semibold">Số tiền</th>
                <th className="px-5 py-4 font-semibold">Trạng thái</th>
                <th className="px-5 py-4 font-semibold">Ngày tạo</th>
                <th className="px-5 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin inline mr-2 text-sky-600" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{inv.customerName || "N/A"}</div>
                      <div className="text-xs text-slate-400 font-mono">{inv.customerEmail}</div>
                    </td>
                    <td className="px-5 py-4">
                      {inv.paymentReference ? (
                        <span className="font-mono bg-sky-50 text-sky-700 font-bold px-2 py-1 rounded text-xs select-all">
                          {inv.paymentReference}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Không có</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">{inv.pendingPlanName}</td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      {formatMoney(inv.total, inv.currency)}
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(inv.status)}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(inv.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {inv.pdfUrl && (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition bg-white"
                          >
                            <FileText className="h-3.5 w-3.5" /> PDF
                          </a>
                        )}

                        {inv.status === "open" && (
                          <button
                            type="button"
                            onClick={() => setConfirmingInvoice(inv)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Duyệt tay
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Xác nhận thanh toán thủ công</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Bạn có chắc chắn muốn xác nhận thanh toán thủ công cho hóa đơn này?</p>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1.5 font-medium">
                <div>Mã hóa đơn: <span className="font-bold text-slate-900">{confirmingInvoice.invoiceNumber}</span></div>
                <div>Khách hàng: <span className="text-slate-900">{confirmingInvoice.customerName}</span></div>
                <div>Gói cước: <span className="text-slate-900">{confirmingInvoice.pendingPlanName}</span></div>
                <div>Số tiền: <span className="font-bold text-slate-900">{formatMoney(confirmingInvoice.total, confirmingInvoice.currency)}</span></div>
                <div>Mã CK: <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">{confirmingInvoice.paymentReference}</span></div>
              </div>
              <p className="text-xs text-rose-600 font-semibold">
                ⚠️ Hành động này sẽ lập tức nâng cấp gói cước cho tài khoản khách hàng và ghi nhận doanh thu vào hệ thống.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={submittingConfirm}
                onClick={() => setConfirmingInvoice(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submittingConfirm}
                onClick={() => void handleConfirmPayment()}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submittingConfirm && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
