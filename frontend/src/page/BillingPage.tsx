import { useEffect, useState } from "react";
import { AlertCircle, Check, CreditCard, Download, FileText, Loader2, X } from "lucide-react";
import {
  pricingApi,
  type BillingData,
  type PricingPlan,
  type UpgradePreview,
} from "../services/pricingApi";
import {
  invoiceApi,
  type InvoiceDetail,
  type InvoiceStatus,
  type InvoiceSummary,
} from "../services/invoiceApi";

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  open: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  void: "bg-slate-100 text-slate-500",
  uncollectible: "bg-rose-100 text-rose-700",
};

export function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<UpgradePreview | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadBilling = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await pricingApi.getBilling();
      setBilling(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load billing information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void pricingApi
      .getBilling()
      .then((response) => {
        if (!cancelled) setBilling(response.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load billing information.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadInvoices = async () => {
    setInvoicesLoading(true);
    setInvoiceError("");
    try {
      const response = await invoiceApi.getInvoices();
      setInvoices(response.data);
    } catch (err) {
      setInvoiceError(err instanceof Error ? err.message : "Unable to load invoices.");
    } finally {
      setInvoicesLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void invoiceApi
      .getInvoices()
      .then((response) => {
        if (!cancelled) setInvoices(response.data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setInvoiceError(err instanceof Error ? err.message : "Unable to load invoices.");
        }
      })
      .finally(() => {
        if (!cancelled) setInvoicesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openInvoice = async (invoiceId: string) => {
    setDetailLoadingId(invoiceId);
    setInvoiceError("");
    try {
      const response = await invoiceApi.getInvoice(invoiceId);
      setSelectedInvoice(response.data);
    } catch (err) {
      setInvoiceError(err instanceof Error ? err.message : "Unable to load invoice details.");
    } finally {
      setDetailLoadingId(null);
    }
  };

  const downloadInvoice = async (invoice: InvoiceSummary) => {
    if (invoice.pdfStatus !== "ready") return;
    setDownloadingId(invoice.id);
    setInvoiceError("");
    try {
      await invoiceApi.downloadPdf(invoice);
    } catch (err) {
      setInvoiceError(err instanceof Error ? err.message : "Unable to download invoice PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const openPreview = async (plan: PricingPlan) => {
    setPreviewingId(plan.id);
    setError("");
    try {
      const response = await pricingApi.previewUpgrade(plan.id);
      setPreview(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate the upgrade charge.");
    } finally {
      setPreviewingId(null);
    }
  };

  const confirmUpgrade = async () => {
    if (!preview) return;
    setConfirming(true);
    setError("");
    try {
      const response = await pricingApi.confirmUpgrade(preview.targetPlan.id);
      setSuccess(response.message);
      setPreview(null);
      await Promise.all([loadBilling(), loadInvoices()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Your plan has not changed.");
      setPreview(null);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Billing</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Manage your subscription</h1>
        <p className="mt-2 text-slate-600">Upgrade your plan and apply new limits immediately.</p>

        {success && (
          <div role="status" className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <Check className="h-5 w-5" /> {success}
          </div>
        )}
        {error && (
          <div role="alert" className="mt-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-sky-600" /> Loading billing…
          </div>
        ) : billing ? (
          <>
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Current plan</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{billing.currentPlan.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {billing.subscription.status === "trialing" ? "Trial" : "Active"} · {billing.subscription.status === "trialing" ? "Ends" : "Renews"} {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {formatMoney(billing.currentPlan.price.amount || 0, billing.currentPlan.price.currency)}
                  </p>
                  <p className="text-sm text-slate-500">per month</p>
                </div>
              </div>
            </section>

            <h2 className="mt-10 text-xl font-bold text-slate-900">Available upgrades</h2>
            {billing.availableUpgrades.length === 0 ? (
              <p className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                You are already on the highest available plan.
              </p>
            ) : (
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {billing.availableUpgrades.map((plan) => (
                  <article key={plan.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                    <p className="mt-5 text-3xl font-extrabold text-slate-900">
                      {formatMoney(plan.price.amount || 0, plan.price.currency)}
                      <span className="text-sm font-normal text-slate-500"> /month</span>
                    </p>
                    <ul className="mt-5 flex-1 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-slate-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      disabled={previewingId !== null}
                      onClick={() => void openPreview(plan)}
                      className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {previewingId === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                      {previewingId === plan.id ? "Calculating…" : `Upgrade to ${plan.name}`}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : null}

        <section className="mt-12" aria-labelledby="invoice-history-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Invoices</p>
              <h2 id="invoice-history-title" className="mt-2 text-2xl font-bold text-slate-900">Invoice history</h2>
              <p className="mt-1 text-sm text-slate-600">View invoice details and download completed PDFs.</p>
            </div>
            {invoiceError && (
              <button type="button" onClick={() => void loadInvoices()} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                Try again
              </button>
            )}
          </div>

          {invoiceError && (
            <div role="alert" className="mt-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{invoiceError}</span>
            </div>
          )}

          {invoicesLoading ? (
            <div className="mt-4 flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" /> Loading invoices…
            </div>
          ) : invoices.length === 0 ? (
            <div className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileText className="h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-800">No invoices yet</h3>
              <p className="mt-1 text-sm text-slate-500">Your invoices will appear here when they are created.</p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Invoice number</th>
                      <th className="px-5 py-4 font-semibold">Created</th>
                      <th className="px-5 py-4 font-semibold">Amount</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-semibold text-slate-900">{invoice.invoiceNumber}</td>
                        <td className="px-5 py-4 text-slate-600">{formatDate(invoice.invoiceDate)}</td>
                        <td className="px-5 py-4 font-medium text-slate-800">{formatMoney(invoice.total, invoice.currency)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${invoiceStatusStyles[invoice.status]}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button type="button" disabled={detailLoadingId !== null} onClick={() => void openInvoice(invoice.id)} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                              {detailLoadingId === invoice.id ? "Loading…" : "View details"}
                            </button>
                            <button type="button" disabled={invoice.pdfStatus !== "ready" || downloadingId !== null} onClick={() => void downloadInvoice(invoice)} className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                              {downloadingId === invoice.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                              {invoice.pdfStatus === "processing" ? "Processing" : downloadingId === invoice.id ? "Downloading…" : "Download PDF"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {preview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Confirm upgrade</p>
                <h2 id="upgrade-title" className="mt-1 text-2xl font-bold text-slate-900">
                  {preview.currentPlan.name} to {preview.targetPlan.name}
                </h2>
              </div>
              <button type="button" disabled={confirming} onClick={() => setPreview(null)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <div className="flex justify-between gap-4 text-sm text-slate-600">
                <span>Charge today</span>
                <strong className="text-lg text-slate-900">
                  {formatMoney(preview.charge.amountDue, preview.charge.currency)}
                </strong>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Your new 30-day billing period starts immediately and runs through {new Date(preview.charge.periodEnd).toLocaleDateString()}.
                New limits take effect after confirmation.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={confirming} onClick={() => setPreview(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" disabled={confirming} onClick={() => void confirmUpgrade()} className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:bg-slate-300">
                {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {confirming ? "Processing…" : "Confirm payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="invoice-detail-title">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Invoice</p>
                <h2 id="invoice-detail-title" className="mt-1 text-2xl font-bold text-slate-900">{selectedInvoice.invoiceNumber}</h2>
              </div>
              <button type="button" onClick={() => setSelectedInvoice(null)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
              <div><dt className="text-xs font-semibold uppercase text-slate-500">Invoice date</dt><dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(selectedInvoice.invoiceDate)}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-slate-500">Due date</dt><dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(selectedInvoice.dueDate)}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-slate-500">Status</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-900">{selectedInvoice.status}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-slate-500">Paid at</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedInvoice.paidAt ? formatDate(selectedInvoice.paidAt) : "—"}</dd></div>
            </dl>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Description</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Amount</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.lineItems.map((item, index) => (
                    <tr key={`${item.description}-${index}`}><td className="px-4 py-3"><p className="font-medium text-slate-800">{item.description}</p><p className="mt-0.5 text-xs text-slate-500">{formatDate(item.periodStart)} – {formatDate(item.periodEnd)}</p></td><td className="px-4 py-3 text-right text-slate-600">{item.quantity}</td><td className="px-4 py-3 text-right font-medium text-slate-800">{formatMoney(item.amount, selectedInvoice.currency)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <dl className="ml-auto mt-5 max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-medium text-slate-800">{formatMoney(selectedInvoice.amount, selectedInvoice.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Tax ({selectedInvoice.taxRate}%)</dt><dd className="font-medium text-slate-800">{formatMoney(selectedInvoice.taxAmount, selectedInvoice.currency)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base"><dt className="font-bold text-slate-900">Total</dt><dd className="font-bold text-slate-900">{formatMoney(selectedInvoice.total, selectedInvoice.currency)}</dd></div>
            </dl>

            <div className="mt-6 flex justify-end">
              <button type="button" disabled={selectedInvoice.pdfStatus !== "ready" || downloadingId !== null} onClick={() => void downloadInvoice(selectedInvoice)} className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {downloadingId === selectedInvoice.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {selectedInvoice.pdfStatus === "processing" ? "PDF processing" : downloadingId === selectedInvoice.id ? "Downloading…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
