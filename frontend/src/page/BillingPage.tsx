import { useEffect, useState } from "react";
import { AlertCircle, Check, CreditCard, Loader2, X } from "lucide-react";
import {
  pricingApi,
  type BillingData,
  type PricingPlan,
  type UpgradePreview,
} from "../services/pricingApi";

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

export function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<UpgradePreview | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState("");

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
      await loadBilling();
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
                    Active · Renews {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}
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
    </div>
  );
}
