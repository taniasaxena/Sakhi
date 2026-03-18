import { CyclePhase } from '../types';

export const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: '#FF3B30',
  follicular: '#FF9500',
  ovulation: '#30D158',
  luteal: '#BF5AF2',
  unknown: '#636366',
};

export const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
  unknown: 'Unknown',
};

export const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  menstrual: 'Your period is here.',
  follicular: 'Energy is building.',
  ovulation: 'Peak fertility window.',
  luteal: 'Winding down.',
  unknown: 'Log your period to get insights.',
};

export const PHASE_DETAIL: Record<CyclePhase, { days: string; what: string }> = {
  menstrual: {
    days: 'Days 1–5',
    what: 'The uterine lining sheds. Estrogen and progesterone are at their lowest. Rest, warmth, and iron-rich foods help.',
  },
  follicular: {
    days: 'Days 6–13',
    what: 'Estrogen rises as follicles develop in the ovaries. Energy, mood, and focus improve — a great time to start new things.',
  },
  ovulation: {
    days: 'Days 14–16',
    what: 'A mature egg is released. Estrogen peaks and LH surges. Fertility is at its highest. You may feel more social and confident.',
  },
  luteal: {
    days: 'Days 17–end',
    what: 'Progesterone rises to prepare the uterus. If no pregnancy occurs, levels drop and PMS symptoms may appear toward the end.',
  },
  unknown: {
    days: '—',
    what: 'Log your period to start tracking your cycle.',
  },
};

export const COLORS = {
  background: '#0A0A0A',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  text: '#FFFFFF',
  textMuted: '#8E8E93',
  border: '#3A3A3C',
  danger: '#FF3B30',
};

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
