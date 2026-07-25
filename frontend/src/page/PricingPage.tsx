import { useEffect, useState } from "react";
import { Check, Database, FolderKanban, Loader2, Monitor, X, CreditCard, Copy, CheckCircle } from "lucide-react";
import { pricingApi, type PricingPlan, type UpgradePreview } from "../services/pricingApi";
import { invoiceApi } from "../services/invoiceApi";
import { useAppStore } from "../store";

const formatLimit = (value: number | null) =>
  value === null ? "Unlimited" : value.toLocaleString();

const formatMoney = (amount: number, currency: string) => {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat(currency === "VND" ? "vi-VN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const getPlanTier = (planId: string) => {
  switch (planId) {
    case "starter": return 0;
    case "professional": return 1;
    case "enterprise": return 2;
    default: return 0;
  }
};

interface PaymentCountdownProps {
  invoiceDate: string;
  onExpire: () => void;
}

function PaymentCountdown({ invoiceDate, onExpire }: PaymentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expiresAt = new Date(invoiceDate).getTime() + 15 * 60 * 1000;

    const update = () => {
      const sec = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(sec);
      if (sec === 0) {
        onExpire();
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [invoiceDate, onExpire]);

  if (timeLeft <= 0) {
    return (
      <span className="text-rose-600 font-bold">
        Expired
      </span>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-100 rounded">
      {formatted}
    </span>
  );
}

export function PricingPage() {
  const isLoggedIn = useAppStore((state) => state.session.isLoggedIn);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [trialPlanId, setTrialPlanId] = useState<string | null>(null);
  const [trialError, setTrialError] = useState("");
  const [trialSuccess, setTrialSuccess] = useState("");
  const [trialEligible, setTrialEligible] = useState<boolean | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  // Upgrade Flow States
  const [preview, setPreview] = useState<UpgradePreview | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // QR Code Payment States
  const [paymentInvoice, setPaymentInvoice] = useState<any>(null);
  const [paymentQrUrl, setPaymentQrUrl] = useState<string | null>(null);
  const [paymentBankDetails, setPaymentBankDetails] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const startTrial = async (plan: PricingPlan) => {
    setTrialPlanId(plan.id);
    setTrialError("");
    setTrialSuccess("");
    try {
      const result = await pricingApi.startTrial(plan.id);
      const trialEnd = new Date(result.data.trialEnd).toLocaleDateString();
      setTrialSuccess(`${result.message} Trial ends on ${trialEnd}.`);
      setTrialEligible(false);
      // Reload current plan slug
      setCurrentPlanId(plan.id);
    } catch (err) {
      setTrialError(err instanceof Error ? err.message : "Unable to start free trial.");
    } finally {
      setTrialPlanId(null);
    }
  };

  const loadPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await pricingApi.getPlans();
      setPlans(result.plans);
      setFromCache(result.fromCache);
    } catch (err) {
      setPlans([]);
      setError(
        err instanceof Error ? err.message : "Unable to load pricing plans.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let cancelled = false;
    void pricingApi
      .getTrialEligibility()
      .then((result) => {
        if (!cancelled) setTrialEligible(result.data.eligible);
      })
      .catch(() => {
        if (!cancelled) setTrialEligible(null);
      });

    void pricingApi
      .getBilling()
      .then((res) => {
        if (!cancelled && res.success && res.data) {
          setCurrentPlanId(res.data.currentPlan.id);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  // Poll open invoice status
  useEffect(() => {
    if (!paymentInvoice || paymentInvoice.status !== "open") return;

    let timer: number;
    const poll = async () => {
      try {
        const response = await invoiceApi.getInvoice(paymentInvoice.id);
        if (response.success && response.data.status === "paid") {
          setPaymentInvoice(response.data);
          setPaymentSuccess(true);
          // Reload current plan slug
          const billingRes = await pricingApi.getBilling();
          if (billingRes.success && billingRes.data) {
            setCurrentPlanId(billingRes.data.currentPlan.id);
          }
        } else {
          timer = window.setTimeout(poll, 4000);
        }
      } catch (err) {
        console.error("Error polling invoice status on pricing page:", err);
        timer = window.setTimeout(poll, 4000);
      }
    };

    timer = window.setTimeout(poll, 4000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [paymentInvoice]);

  const handleCopy = (text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openPreview = async (plan: PricingPlan) => {
    setPreviewingId(plan.id);
    setTrialError("");
    setTrialSuccess("");
    try {
      const response = await pricingApi.previewUpgrade(plan.id);
      setPreview(response.data);
    } catch (err) {
      setTrialError(err instanceof Error ? err.message : "Unable to calculate the upgrade charge.");
    } finally {
      setPreviewingId(null);
    }
  };

  const confirmUpgrade = async () => {
    if (!preview) return;
    setConfirming(true);
    setTrialError("");
    try {
      const response = await pricingApi.confirmUpgrade(preview.targetPlan.id);
      if (response.data?.invoice?.status === "open") {
        setPaymentInvoice(response.data.invoice);
        setPaymentQrUrl(response.data.vietQrUrl || null);
        setPaymentBankDetails(response.data.bankDetails || null);
        setPaymentSuccess(false);
        setPreview(null);
      } else {
        setTrialSuccess(response.message);
        setPreview(null);
        // Reload current plan
        const billingRes = await pricingApi.getBilling();
        if (billingRes.success && billingRes.data) {
          setCurrentPlanId(billingRes.data.currentPlan.id);
        }
      }
    } catch (err) {
      setTrialError(err instanceof Error ? err.message : "Payment failed. Your plan has not changed.");
      setPreview(null);
    } finally {
      setConfirming(false);
    }
  };

  const currentTier = currentPlanId ? getPlanTier(currentPlanId) : 0;

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
            Choose the plan that fits your modernization
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Compare project, monthly screen and storage limits at a glance.
          </p>
        </div>

        {fromCache && (
          <p className="mx-auto mt-6 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Live pricing is unavailable. Showing the most recently saved
            pricing.
          </p>
        )}

        {trialSuccess && (
          <p role="status" className="mx-auto mt-6 max-w-3xl rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
            {trialSuccess}
          </p>
        )}
        {trialError && (
          <p role="alert" className="mx-auto mt-6 max-w-3xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">
            {trialError}
          </p>
        )}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-sky-600" /> Loading
            pricing plans…
          </div>
        ) : error ? (
          <div className="mx-auto mt-12 max-w-lg rounded-xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-rose-700">
              Pricing is currently unavailable.
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={() => void loadPlans()}
              className="mt-5 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Try again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-16 text-center text-slate-500">
            No pricing plans are available.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${plan.highlighted ? "border-sky-500 ring-2 ring-sky-100" : "border-slate-200"}`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
                    Most popular
                  </span>
                )}
                <h2 className="text-xl font-bold text-slate-900">
                  {plan.name}
                </h2>
                <p className="mt-2 min-h-10 text-sm text-slate-500">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {plan.price.amount === null
                      ? "Contact us"
                      : plan.price.amount === 0
                        ? "Free"
                        : formatMoney(plan.price.amount, plan.price.currency)}
                  </span>
                  {plan.price.amount !== null && plan.price.amount > 0 && (
                    <span className="pb-1 text-sm text-slate-500">
                      /{plan.price.interval === "month" ? "month" : plan.price.interval}
                    </span>
                  )}
                </div>
                <dl className="mt-7 space-y-3 border-y border-slate-100 py-5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <FolderKanban className="h-4 w-4" /> Projects
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {formatLimit(plan.limits.projects)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Monitor className="h-4 w-4" /> Screens/month
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {formatLimit(plan.limits.screensPerMonth)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="flex items-center gap-2 text-slate-500">
                      <Database className="h-4 w-4" /> Storage
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {plan.limits.storageGb === null
                        ? "Unlimited"
                        : `${plan.limits.storageGb} GB`}
                    </dd>
                  </div>
                </dl>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-sm text-slate-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{" "}
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Subscribing / Upgrading Action button */}
                <div className="mt-7">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => setActivePage('login')}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      Sign in to subscribe
                    </button>
                  ) : getPlanTier(plan.id) === currentTier ? (
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
                    >
                      Current plan
                    </button>
                  ) : getPlanTier(plan.id) < currentTier ? (
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed"
                    >
                      {plan.id === "starter" ? "Default" : "Included"}
                    </button>
                  ) : plan.name === "Professional" && trialEligible === true ? (
                    <button
                      type="button"
                      disabled={trialPlanId !== null || Boolean(trialSuccess)}
                      onClick={() => void startTrial(plan)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {trialPlanId === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                      {trialPlanId === plan.id ? "Activating..." : "Start 14-day free trial"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={previewingId !== null}
                      onClick={() => void openPreview(plan)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {previewingId === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                      {previewingId === plan.id ? "Processing..." : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Confirm Subscription</p>
                <h2 id="upgrade-title" className="mt-1 text-2xl font-bold text-slate-900">
                  Upgrade to plan {preview.targetPlan.name}
                </h2>
              </div>
              <button type="button" disabled={confirming} onClick={() => setPreview(null)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <div className="flex justify-between gap-4 text-sm text-slate-600">
                <span>Payment Amount</span>
                <strong className="text-lg text-slate-900 font-extrabold">
                  {formatMoney(preview.charge.amountDue, preview.charge.currency)}
                </strong>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Your 30-day billing cycle will start immediately and extend to {new Date(preview.charge.periodEnd).toLocaleDateString()}.
                New limits will apply as soon as the transaction completes.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={confirming} onClick={() => setPreview(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" disabled={confirming} onClick={() => void confirmUpgrade()} className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:bg-slate-300">
                {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {confirming ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Countdown Payment Modal */}
      {paymentInvoice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Invoice Payment</p>
                <h2 id="payment-title" className="mt-1 text-2xl font-bold text-slate-900">
                  Bank Transfer Payment
                </h2>
              </div>
              <button type="button" onClick={() => setPaymentInvoice(null)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentInvoice.status === "void" ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <X className="h-10 w-10 text-rose-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Transaction expired!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  The 15-minute transfer window has expired. This transaction has been cancelled. Please register again.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setPaymentInvoice(null)}
                    className="w-full bg-slate-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-slate-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-600 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Payment received for invoice #{paymentInvoice.invoiceNumber}. Your account has been upgraded!
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setPaymentInvoice(null)}
                    className="w-full bg-sky-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-sky-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left side: QR Code (large size) */}
                <div className="flex flex-col items-center justify-center border border-slate-100 rounded-xl p-4 bg-slate-50">
                  {paymentQrUrl ? (
                    <>
                      <img
                        src={paymentQrUrl}
                        alt="QR Code"
                        className="w-[240px] h-[240px] object-contain rounded-lg shadow-sm border border-slate-200"
                      />
                      <p className="mt-3 text-[10px] text-center text-slate-500 font-medium max-w-[180px]">
                        Scan the QR code with your Mobile Banking app to complete the transfer.
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                      <p className="text-xs text-slate-500 mt-2">Loading QR code...</p>
                    </div>
                  )}
                </div>

                {/* Right side: Bank Details */}
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 text-xs text-rose-800 font-medium">
                    ⚠️ Please transfer the exact amount with the exact payment reference below for automated approval.
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Account Number</span>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-bold text-slate-900 select-all">{paymentBankDetails?.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentBankDetails?.accountNumber || "", "accountNumber")}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedField === "accountNumber" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Account Holder</span>
                      <span className="block font-semibold text-slate-800 mt-0.5">{paymentBankDetails?.accountName}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount</span>
                      <span className="block font-extrabold text-slate-950 text-base mt-0.5">
                        {formatMoney(paymentInvoice.total, paymentInvoice.currency || "VND")}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment Reference</span>
                      <div className="flex items-center justify-between gap-2 mt-1 p-2 rounded-lg bg-sky-50 border border-sky-100">
                        <span className="font-mono font-bold text-sky-800 text-sm select-all">{paymentInvoice.paymentReference}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentInvoice.paymentReference || "", "paymentReference")}
                          className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 shrink-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedField === "paymentReference" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Time Remaining</span>
                      <div className="mt-1 flex items-center gap-2">
                        <PaymentCountdown
                          invoiceDate={paymentInvoice.invoiceDate}
                          onExpire={() => setPaymentInvoice((prev: any) => prev ? { ...prev, status: "void" } : null)}
                        />
                        <span className="text-[10px] text-slate-500">Transaction cancels automatically after 15 minutes.</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center gap-2 text-slate-500 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                    <span>Waiting for bank payment confirmation...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
