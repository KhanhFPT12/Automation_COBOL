import { apiFetch as apiFetchAbsolute } from './apiClient';

const BASE = '/api/auth';

function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return apiFetchAbsolute<T>(`${BASE}${path}`, options);
}

export interface ApiUser {
  _id: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  businessEmail?: string;
  phone?: string;
  accountType: 'INDIVIDUAL' | 'ENTERPRISE';
  role: 'USER' | 'ENTERPRISE_ADMIN' | 'ADMIN';
  isEmailVerified: boolean;
  avatarUrl?: string;
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

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (credential: string) =>
    apiFetch<LoginResponse>('/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
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

  updateProfile: (data: { fullName?: string; phone?: string }) => apiFetch<{ success: boolean; user: ApiUser }>('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (currentPassword: string, newPassword: string) => apiFetch<{ success: boolean; message: string }>('/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  resetPassword: (token: string, password: string) => apiFetch<{ success: boolean; message: string }>('/reset-password/' + token, { method: 'POST', body: JSON.stringify({ password }) }),
  getMe: () => apiFetch<{ success: boolean; user: ApiUser }>('/me'),
};
