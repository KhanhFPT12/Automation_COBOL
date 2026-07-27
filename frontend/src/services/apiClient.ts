// Shared fetch wrapper for the Node/Mongo backend (used by authApi, meetingApi,
// notificationApi, adminApi). Behavior is unchanged from the wrapper that used
// to live only in authApi.ts - just extracted so it isn't duplicated 4x.
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('alsm_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + path : path;
  const res = await fetch(url, { ...options, headers });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data as T;
}
