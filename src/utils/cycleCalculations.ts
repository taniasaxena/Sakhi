import { differenceInDays, addDays, subDays, parseISO } from 'date-fns';
import { CyclePhase, CycleInfo, PeriodLog, UserProfile } from '../types';
import { DEFAULT_CYCLE_LENGTH } from '../lib/constants';

export function getLastPeriodStartDate(logs: PeriodLog[]): Date | null {
  if (logs.length === 0) return null;
  const sorted = [...logs].sort(
    (a, b) => parseISO(b.start_date).getTime() - parseISO(a.start_date).getTime()
  );
  return parseISO(sorted[0].start_date);
}

export function getCurrentDayOfCycle(lastPeriodStart: Date, today: Date): number {
  const diff = differenceInDays(today, lastPeriodStart);
  return Math.max(1, diff + 1);
}

export function getCyclePhase(dayOfCycle: number, cycleLength: number): CyclePhase {
  if (dayOfCycle >= 1 && dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle >= 6 && dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle >= 14 && dayOfCycle <= 16) return 'ovulation';
  if (dayOfCycle >= 17 && dayOfCycle <= cycleLength) return 'luteal';
  if (dayOfCycle > cycleLength) return 'menstrual'; // overdue
  return 'unknown';
}

export function getPredictedNextPeriodDate(lastPeriodStart: Date, cycleLength: number): Date {
  return addDays(lastPeriodStart, cycleLength);
}

export function getDaysUntilNextPeriod(nextPeriodDate: Date, today: Date): number {
  return Math.max(0, differenceInDays(nextPeriodDate, today));
}

export function getOvulationWindow(nextPeriodDate: Date): { start: Date; end: Date } {
  const peak = subDays(nextPeriodDate, 14);
  return {
    start: subDays(peak, 1),
    end: addDays(peak, 1),
  };
}

export function computeAverageCycleLength(
  logs: PeriodLog[],
  fallback: number = DEFAULT_CYCLE_LENGTH
): number {
  if (logs.length < 2) return fallback;
  const sorted = [...logs]
    .sort((a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime())
    .slice(-4); // last 4 logs → up to 3 gaps

  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = differenceInDays(
      parseISO(sorted[i].start_date),
      parseISO(sorted[i - 1].start_date)
    );
    if (gap > 0) gaps.push(gap);
  }

  if (gaps.length === 0) return fallback;
  return Math.round(gaps.reduce((sum, g) => sum + g, 0) / gaps.length);
}

export function computeCycleInfo(
  logs: PeriodLog[],
  profile: UserProfile,
  today: Date
): CycleInfo | null {
  const lastStart = getLastPeriodStartDate(logs);
  if (!lastStart) return null;

  const cycleLength = computeAverageCycleLength(logs, profile.cycle_length);
  const currentDayOfCycle = getCurrentDayOfCycle(lastStart, today);
  const currentPhase = getCyclePhase(currentDayOfCycle, cycleLength);
  const predictedNextPeriodDate = getPredictedNextPeriodDate(lastStart, cycleLength);
  const daysUntilNextPeriod = getDaysUntilNextPeriod(predictedNextPeriodDate, today);
  const { start: ovulationWindowStart, end: ovulationWindowEnd } =
    getOvulationWindow(predictedNextPeriodDate);

  return {
    currentPhase,
    currentDayOfCycle,
    daysUntilNextPeriod,
    predictedNextPeriodDate,
    ovulationWindowStart,
    ovulationWindowEnd,
    cycleLength,
  };
}
