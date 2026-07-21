import { apiFetch } from './apiClient';
import type { AppNotification } from '../types';

const BASE = '/api/notifications';

export const notificationApi = {
  getMine: () =>
    apiFetch<{ success: boolean; notifications: AppNotification[]; unreadCount: number }>(BASE),

  markAsRead: (id: string) =>
    apiFetch<{ success: boolean; notification: AppNotification }>(`${BASE}/${id}/read`, {
      method: 'PATCH',
    }),

  markAllAsRead: () =>
    apiFetch<{ success: boolean }>(`${BASE}/read-all`, { method: 'PATCH' }),
};
