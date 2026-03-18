import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, setToken, clearToken, getToken } from '../lib/api';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'sakhi_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from AsyncStorage on app start
  useEffect(() => {
    (async () => {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const [token, stored] = await Promise.all([
        getToken(),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (token && stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await apiRequest<{ token: string; user: AuthUser }>(
      '/auth/signin',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    if (error) return error;
    await persistSession(data!.token, data!.user);
    return null;
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await apiRequest<{ token: string; user: AuthUser }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    if (error) return error;
    await persistSession(data!.token, data!.user);
    return null;
  };

  const signOut = async () => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await Promise.all([clearToken(), AsyncStorage.removeItem(USER_KEY)]);
    setUser(null);
  };

  const persistSession = async (token: string, authUser: AuthUser) => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await Promise.all([setToken(token), AsyncStorage.setItem(USER_KEY, JSON.stringify(authUser))]);
    setUser(authUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
