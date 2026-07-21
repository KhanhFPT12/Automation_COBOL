import { apiFetch } from './apiClient';
import type { BookMeetingPayload, Meeting } from '../types';

const BASE = '/api/meetings';

export const meetingApi = {
  create: (payload: BookMeetingPayload) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMine: () =>
    apiFetch<{ success: boolean; meetings: Meeting[] }>(`${BASE}/my`),

  getById: (id: string) =>
    apiFetch<{ success: boolean; meeting: Meeting }>(`${BASE}/${id}`),

  cancel: (id: string) =>
    apiFetch<{ success: boolean; message: string; meeting: Meeting }>(`${BASE}/${id}/cancel`, {
      method: 'PATCH',
    }),
};
