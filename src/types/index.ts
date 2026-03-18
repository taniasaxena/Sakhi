export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'unknown';

export interface PeriodLog {
  id: string;
  user_id: string;
  start_date: string; // ISO date "YYYY-MM-DD"
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  cycle_length: number;
  period_length: number;
  created_at: string;
}

export interface CycleInfo {
  currentPhase: CyclePhase;
  currentDayOfCycle: number;
  daysUntilNextPeriod: number;
  predictedNextPeriodDate: Date;
  ovulationWindowStart: Date;
  ovulationWindowEnd: Date;
  cycleLength: number;
}
