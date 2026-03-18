import { useMemo } from 'react';
import { useCycle } from '../context/CycleContext';
import { computeCycleInfo } from '../utils/cycleCalculations';
import { CycleInfo } from '../types';

export function useCycleCalculations(): CycleInfo | null {
  const { periodLogs, profile } = useCycle();

  return useMemo(() => {
    if (!profile || periodLogs.length === 0) return null;
    return computeCycleInfo(periodLogs, profile, new Date());
  }, [periodLogs, profile]);
}
