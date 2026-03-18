import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
      supabase
        .from('period_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false }),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ]);

    if (logsResult.error) {
      setError(logsResult.error.message);
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
    const { error } = await supabase.from('period_logs').insert({
      user_id: user.id,
      start_date: startDate,
      end_date: endDate ?? null,
      notes: notes ?? null,
    });
    if (error) return error.message;
    await fetchData();
    return null;
  };

  const updateLog = async (
    id: string,
    data: Partial<Pick<PeriodLog, 'start_date' | 'end_date' | 'notes'>>
  ): Promise<string | null> => {
    const { error } = await supabase.from('period_logs').update(data).eq('id', id);
    if (error) return error.message;
    await fetchData();
    return null;
  };

  const deleteLog = async (id: string): Promise<string | null> => {
    const { error } = await supabase.from('period_logs').delete().eq('id', id);
    if (error) return error.message;
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
