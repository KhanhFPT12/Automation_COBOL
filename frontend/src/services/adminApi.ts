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
};
