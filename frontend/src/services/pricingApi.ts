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
};
