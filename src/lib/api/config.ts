export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (__DEV__ ? 'http://localhost:8000/api/v1' : 'https://api.balance.app/api/v1');

export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;
