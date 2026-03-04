import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { api, TOKEN_KEYS } from '@/lib/api';

type LoginCredentials = { email: string; password: string };
type LoginResponse = { meta: { access_token: string; refresh_token: string } };
type RefreshResponse = { meta: { access_token: string } };

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthState() {
      try {
        const accessToken = await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
        if (accessToken) {
          setIsAuthenticated(true);
          return;
        }

        const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
        if (refreshToken) {
          try {
            const data = await api.post<RefreshResponse>('/tokens/refresh', { refresh: refreshToken });
            await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, data.meta.access_token);
            setIsAuthenticated(true);
          } catch {
            await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
          }
        }
      } catch {
        // Stay unauthenticated on any unexpected error
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthState();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    console.debug('Attempting login with credentials', credentials);
    const data = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
    console.debug('Login successful, received tokens', data);
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, data.meta.access_token);
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, data.meta.refresh_token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
