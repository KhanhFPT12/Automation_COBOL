const BASE = '/api/auth';

// ─── Generic fetch wrapper ────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('alsm_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data as T;
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
  role: 'USER' | 'ENTERPRISE_ADMIN';
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
