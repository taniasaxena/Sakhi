import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator reaches host machine via 10.0.2.2; iOS simulator uses localhost
const DEFAULT_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL;

const TOKEN_KEY = 'sakhi_token';

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options.headers as Record<string, string>) ?? {}),
      },
    });

    const json = await res.json();
    if (!res.ok) return { error: json.error ?? json.message ?? 'Request failed' };
    return { data: json as T };
  } catch {
    return { error: 'Network error — is the API running?' };
  }
}
