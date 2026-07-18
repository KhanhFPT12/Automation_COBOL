import { apiFetch as apiFetchAbsolute } from './apiClient';

const BASE = '/api/auth';

// ─── Generic fetch wrapper (kept as a thin local alias so every call site
// below is unchanged) ──────────────────────────────────────────────
function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return apiFetchAbsolute<T>(`${BASE}${path}`, options);
}

// ─── Types ────────────────────────────────────────────────────────
export interface ApiUser {
  _id: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  businessEmail?: string;
  phone: string;
  accountType: 'INDIVIDUAL' | 'ENTERPRISE';
  role: 'USER' | 'ENTERPRISE_ADMIN' | 'ADMIN';
  isEmailVerified: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: ApiUser;
}

export interface RegisterIndividualPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterEnterprisePayload {
  companyName: string;
  businessEmail: string;
  password: string;
  phone: string;
  representativeName: string;
  representativePosition: string;
  companySize?: string;
  industry?: string;
  legacySystemType?: string[];
  targetTechStack?: string[];
}

// ─── Auth API calls ───────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerIndividual: (payload: RegisterIndividualPayload) =>
    apiFetch<{ success: boolean; message: string }>('/register/individual', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  registerEnterprise: (payload: RegisterEnterprisePayload) =>
    apiFetch<{ success: boolean; message: string }>('/register/enterprise', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ success: boolean; message: string }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ success: boolean; message: string }>('/resend-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getMe: () => apiFetch<{ success: boolean; user: ApiUser }>('/me'),
};
