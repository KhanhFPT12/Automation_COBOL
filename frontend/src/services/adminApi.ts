import { apiFetch } from './apiClient';
import type {
  ActivityItem,
  AdminUser,
  ConversionLogEntry,
  DashboardCharts,
  DashboardStats,
  Meeting,
  Pagination,
} from '../types';

export interface AdminSubscription {
  id: string;
  planName: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancellationReason: string | null;
}

const BASE = '/api/admin';

function qs(params: Record<string, string | number | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join('&');
}

export const adminApi = {
  // ─── Dashboard ─────────────────────────────────────────────────
  getStats: () =>
    apiFetch<{ success: boolean; stats: DashboardStats; charts: DashboardCharts }>(
      `${BASE}/dashboard/stats`
    ),

  getActivity: () =>
    apiFetch<{ success: boolean; activity: ActivityItem[] }>(`${BASE}/dashboard/activity`),

  // ─── Conversion history ────────────────────────────────────────
  listConversions: (params: { page?: number; limit?: number; fileType?: string } = {}) =>
    apiFetch<{ success: boolean; conversions: ConversionLogEntry[]; pagination: Pagination }>(
      `${BASE}/conversions${qs(params)}`
    ),

  // ─── User management ───────────────────────────────────────────
  listUsers: (params: { search?: string; page?: number; limit?: number } = {}) =>
    apiFetch<{ success: boolean; users: AdminUser[]; pagination: Pagination }>(
      `${BASE}/users${qs(params)}`
    ),

  getUserDetail: (id: string) =>
    apiFetch<{
      success: boolean;
      user: AdminUser;
      conversionHistory: ConversionLogEntry[];
      meetingHistory: Meeting[];
      paymentHistory: unknown[];
      subscription: AdminSubscription | null;
    }>(`${BASE}/users/${id}`),

  updateUser: (id: string, updates: Partial<AdminUser>) =>
    apiFetch<{ success: boolean; message: string; user: AdminUser }>(`${BASE}/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  lockUser: (id: string) =>
    apiFetch<{ success: boolean; message: string; user: AdminUser }>(`${BASE}/users/${id}/lock`, {
      method: 'PATCH',
    }),

  unlockUser: (id: string) =>
    apiFetch<{ success: boolean; message: string; user: AdminUser }>(`${BASE}/users/${id}/unlock`, {
      method: 'PATCH',
    }),

  deleteUser: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`${BASE}/users/${id}`, {
      method: 'DELETE',
    }),

  reactivateSubscription: (id: string) =>
    apiFetch<{ success: boolean; message: string; subscription: AdminSubscription }>(
      `${BASE}/users/${id}/subscription/reactivate`,
      { method: 'PATCH' }
    ),

  // ─── Meeting management ────────────────────────────────────────
  listMeetings: (params: { status?: string; search?: string; page?: number; limit?: number } = {}) =>
    apiFetch<{ success: boolean; meetings: Meeting[]; pagination: Pagination }>(
      `${BASE}/meetings${qs(params)}`
    ),

  getMeeting: (id: string) =>
    apiFetch<{ success: boolean; meeting: Meeting }>(`${BASE}/meetings/${id}`),

  approveMeeting: (
    id: string,
    overrides: { topic?: string; description?: string; preferredDate?: string; preferredTime?: string; duration?: number } = {}
  ) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(
      `${BASE}/meetings/${id}/approve`,
      { method: 'PATCH', body: JSON.stringify(overrides) }
    ),

  rejectMeeting: (id: string, reason: string) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(
      `${BASE}/meetings/${id}/reject`,
      { method: 'PATCH', body: JSON.stringify({ reason }) }
    ),

  cancelMeeting: (id: string) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(
      `${BASE}/meetings/${id}/cancel`,
      { method: 'PATCH' }
    ),

  completeMeeting: (id: string) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(
      `${BASE}/meetings/${id}/complete`,
      { method: 'PATCH' }
    ),

  // ─── Google Calendar integration ────────────────────────────────
  getGoogleStatus: () =>
    apiFetch<{ success: boolean; connected: boolean; connectedEmail: string | null }>(
      `${BASE}/google/status`
    ),

  getGoogleConnectUrl: () =>
    apiFetch<{ success: boolean; url?: string; message?: string }>(`${BASE}/google/connect`),

  disconnectGoogle: () =>
    apiFetch<{ success: boolean; message: string }>(`${BASE}/google`, { method: 'DELETE' }),

  // ─── Bank account settings ──────────────────────────────────────
  getBankAccounts: () =>
    apiFetch<{
      success: boolean;
      data: Array<{ id: string; bin: string; accountNumber: string; accountName: string; isDefault: boolean; updatedAt: string }>;
    }>(`${BASE}/settings/bank-account`),

  createBankAccount: (data: { bin: string; accountNumber: string; accountName: string; isDefault?: boolean }) =>
    apiFetch<{
      success: boolean;
      message: string;
      data: { id: string; bin: string; accountNumber: string; accountName: string; isDefault: boolean; updatedAt: string };
    }>(`${BASE}/settings/bank-account`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBankAccount: (id: string, data: { bin: string; accountNumber: string; accountName: string }) =>
    apiFetch<{
      success: boolean;
      message: string;
      data: { id: string; bin: string; accountNumber: string; accountName: string; isDefault: boolean; updatedAt: string };
    }>(`${BASE}/settings/bank-account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBankAccount: (id: string) =>
    apiFetch<{
      success: boolean;
      message: string;
    }>(`${BASE}/settings/bank-account/${id}`, {
      method: 'DELETE',
    }),

  setDefaultBankAccount: (id: string) =>
    apiFetch<{
      success: boolean;
      message: string;
      data: { id: string; bin: string; accountNumber: string; accountName: string; isDefault: boolean; updatedAt: string };
    }>(`${BASE}/settings/bank-account/${id}/default`, {
      method: 'PATCH',
    }),

  getBankAccountAuditLogs: () =>
    apiFetch<{
      success: boolean;
      data: Array<{ id: string; action: string; description: string; performedBy: string; createdAt: string; ipAddress: string }>;
    }>(`${BASE}/settings/bank-account/audit-logs`),

  // ─── Plan settings ───────────────────────────────────────────────
  getPlans: () =>
    apiFetch<{
      success: boolean;
      data: Array<{
        _id: string;
        name: string;
        slug: string;
        description: string;
        price_monthly: number | null;
        price_yearly: number | null;
        currency: string;
        limits: {
          max_projects: number | null;
          max_screens_per_month: number | null;
          max_storage_gb: number | null;
          max_team_members: number | null;
        };
        features: string[];
        is_active: boolean;
        display_order: number;
        badge_text: string;
        updatedAt: string;
      }>;
    }>(`${BASE}/settings/plans`),

  updatePlan: (
    id: string,
    data: {
      name?: string;
      description?: string;
      priceMonthly?: number | null;
      priceYearly?: number | null;
      currency?: string;
      limits?: {
        maxProjects?: number | null;
        maxScreensPerMonth?: number | null;
        maxStorageGb?: number | null;
        maxTeamMembers?: number | null;
      };
      features?: string[];
      isActive?: boolean;
      badgeText?: string;
      displayOrder?: number;
    }
  ) =>
    apiFetch<{
      success: boolean;
      message: string;
      data: any;
    }>(`${BASE}/settings/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ─── Invoice management ──────────────────────────────────────────
  getInvoices: () =>
    apiFetch<{
      success: boolean;
      data: AdminInvoice[];
    }>(`${BASE}/settings/invoices`),

  confirmInvoicePayment: (id: string) =>
    apiFetch<{
      success: boolean;
      message: string;
      data: any;
    }>(`${BASE}/settings/invoices/${id}/confirm`, {
      method: "POST",
    }),
};

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  total: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  paymentReference?: string;
  createdAt: string;
  paidAt: string | null;
  customerEmail: string;
  customerName: string;
  pendingPlanName: string;
  pdfUrl: string | null;
}
