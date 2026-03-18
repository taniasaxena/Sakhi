import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { PeriodLog, UserProfile } from '../types';
import { useAuth } from './AuthContext';

interface CycleContextType {
  periodLogs: PeriodLog[];
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  addLog: (startDate: string, endDate?: string, notes?: string) => Promise<string | null>;
  updateLog: (id: string, data: Partial<Pick<PeriodLog, 'start_date' | 'end_date' | 'notes'>>) => Promise<string | null>;
  deleteLog: (id: string) => Promise<string | null>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const [logsResult, profileResult] = await Promise.all([
      apiRequest<PeriodLog[]>('/api/periods'),
      apiRequest<UserProfile>('/api/profile'),
    ]);

    if (logsResult.error) {
      setError(logsResult.error);
    } else {
      setPeriodLogs(logsResult.data ?? []);
    }

    if (profileResult.data) {
      setProfile(profileResult.data);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
    else {
      setPeriodLogs([]);
      setProfile(null);
    }
  }, [user, fetchData]);

  const addLog = async (
    startDate: string,
    endDate?: string,
    notes?: string
  ): Promise<string | null> => {
    if (!user) return 'Not authenticated';
    const { error } = await apiRequest('/api/periods', {
      method: 'POST',
      body: JSON.stringify({ start_date: startDate, end_date: endDate, notes }),
    });
    if (error) return error;
    await fetchData();
    return null;
  };

  const updateLog = async (
    id: string,
    data: Partial<Pick<PeriodLog, 'start_date' | 'end_date' | 'notes'>>
  ): Promise<string | null> => {
    const { error } = await apiRequest(`/api/periods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (error) return error;
    await fetchData();
    return null;
  };

  const deleteLog = async (id: string): Promise<string | null> => {
    const { error } = await apiRequest(`/api/periods/${id}`, { method: 'DELETE' });
    if (error) return error;
    await fetchData();
    return null;
  };

  return (
    <CycleContext.Provider
      value={{ periodLogs, profile, loading, error, fetchData, addLog, updateLog, deleteLog }}
    >
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const ctx = useContext(CycleContext);
  if (!ctx) throw new Error('useCycle must be used within CycleProvider');
  return ctx;
}
