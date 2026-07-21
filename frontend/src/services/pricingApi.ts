import { apiFetch } from "./apiClient";

export interface PricingPlan {
  id: string;
  name: "Starter" | "Professional" | "Enterprise";
  description: string;
  price: {
    amount: number | null;
    yearlyAmount: number | null;
    currency: string;
    interval: string;
  };
  limits: {
    projects: number | null;
    screensPerMonth: number | null;
    storageGb: number | null;
    teamMembers: number | null;
  };
  features: string[];
  highlighted?: boolean;
  badgeText?: string;
}

interface PricingResponse {
  success: boolean;
  data: PricingPlan[];
}

export interface TrialSubscription {
  id: string;
  planId: string;
  planName: string;
  status: "trialing";
  trialStart: string;
  trialEnd: string;
  currentPeriodEnd: string;
  usage: {
    projects_used: number;
    screens_converted_this_month: number;
    storage_used_mb: number;
    last_calculated_at: string;
  };
}

interface TrialResponse {
  success: boolean;
  message: string;
  data: TrialSubscription;
}

export interface BillingSubscription {
  id: string;
  status: "active";
  currentPeriodEnd: string;
}

export interface BillingData {
  subscription: BillingSubscription;
  currentPlan: PricingPlan;
  availableUpgrades: PricingPlan[];
}

export interface UpgradePreview {
  currentPlan: PricingPlan;
  targetPlan: PricingPlan;
  charge: {
    amountDue: number;
    currency: string;
    periodStart: string;
    periodEnd: string;
  };
}

interface BillingResponse {
  success: boolean;
  data: BillingData;
}

interface UpgradePreviewResponse {
  success: boolean;
  data: UpgradePreview;
}

interface UpgradeResponse {
  success: boolean;
  message: string;
  data: {
    subscription: BillingSubscription;
    plan: PricingPlan;
    charge: UpgradePreview["charge"];
  };
}

const CACHE_KEY = "alsm_pricing_plans";

function readCachedPlans(): PricingPlan[] {
  try {
    const value = localStorage.getItem(CACHE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as { plans?: PricingPlan[] };
    return Array.isArray(parsed.plans) ? parsed.plans : [];
  } catch {
    return [];
  }
}

export const pricingApi = {
  getPlans: async (): Promise<{ plans: PricingPlan[]; fromCache: boolean }> => {
    try {
      const response = await apiFetch<PricingResponse>("/api/pricing");
      const plans = Array.isArray(response.data) ? response.data : [];
      if (plans.length > 0) {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ plans, cachedAt: new Date().toISOString() }),
        );
      }
      return { plans, fromCache: false };
    } catch (error) {
      const plans = readCachedPlans();
      if (plans.length > 0) return { plans, fromCache: true };
      throw error;
    }
  },
  startTrial: (planId: string) =>
    apiFetch<TrialResponse>("/api/pricing/trial", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
  getBilling: () => apiFetch<BillingResponse>("/api/pricing/billing"),
  previewUpgrade: (planId: string) =>
    apiFetch<UpgradePreviewResponse>("/api/pricing/upgrade/preview", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
  confirmUpgrade: (planId: string) =>
    apiFetch<UpgradeResponse>("/api/pricing/upgrade/confirm", {
      method: "POST",
      body: JSON.stringify({ planId, paymentConfirmed: true }),
    }),
};
