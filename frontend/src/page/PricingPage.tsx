import { useEffect, useState } from "react";
import { Check, Database, FolderKanban, Loader2, Monitor } from "lucide-react";
import { pricingApi, type PricingPlan } from "../services/pricingApi";
import { useAppStore } from "../store";

const formatLimit = (value: number | null) =>
  value === null ? "Unlimited" : value.toLocaleString();

export function PricingPage() {
  const isLoggedIn = useAppStore((state) => state.session.isLoggedIn);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [trialPlanId, setTrialPlanId] = useState<string | null>(null);
  const [trialError, setTrialError] = useState("");
  const [trialSuccess, setTrialSuccess] = useState("");
  const [trialEligible, setTrialEligible] = useState<boolean | null>(null);

  const startTrial = async (plan: PricingPlan) => {
    setTrialPlanId(plan.id);
    setTrialError("");
    setTrialSuccess("");
    try {
      const result = await pricingApi.startTrial(plan.id);
      const trialEnd = new Date(result.data.trialEnd).toLocaleDateString();
      setTrialSuccess(`${result.message} Trial ends on ${trialEnd}.`);
      setTrialEligible(false);
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
    let cancelled = false;

    void pricingApi
      .getPlans()
      .then((result) => {
        if (cancelled) return;
        setPlans(result.plans);
        setFromCache(result.fromCache);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setPlans([]);
        setError(
          err instanceof Error ? err.message : "Unable to load pricing plans.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

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
                        : `$${plan.price.amount}`}
                  </span>
                  {plan.price.amount !== null && plan.price.amount > 0 && (
                    <span className="pb-1 text-sm text-slate-500">
                      /{plan.price.interval}
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
                {plan.name === "Professional" && (
                  <button
                    type="button"
                    disabled={trialPlanId !== null || (isLoggedIn && trialEligible !== true) || Boolean(trialSuccess)}
                    onClick={() => void startTrial(plan)}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {trialPlanId === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    {trialPlanId === plan.id
                      ? "Starting trial…"
                      : isLoggedIn && trialEligible === null
                        ? "Checking trial availability…"
                      : trialEligible === false
                        ? "Free trial already used"
                        : "Start free 14-day trial"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
