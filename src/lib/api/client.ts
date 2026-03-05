import * as SecureStore from 'expo-secure-store';

import { BASE_URL, TOKEN_KEYS } from './config';
import { ApiError, type ApiErrorBody } from './types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const requestUrl = `${BASE_URL}${path}`;
  console.debug(`API Request: method=${options.method ?? 'GET'} url=${requestUrl}`);
  const response = await fetch(requestUrl, { ...options, headers });
  console.debug(`API Response: url=${requestUrl} status=${response.status}`);
  if (!response.ok) {
    let body: ApiErrorBody = {};
    console.debug(`API Error Response: url=${requestUrl} status=${response.status} body=`, response);
    try {
      body = await response.json();
    } catch {
      // Non-JSON error body — leave body empty
    }
    throw new ApiError(response.status, body);
  }

  // 204 No Content — returned by DELETE endpoints
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
