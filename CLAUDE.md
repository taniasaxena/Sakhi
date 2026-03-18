# Sakhi — Claude Context

## Project Overview

Sakhi is a women's health mobile app built with React Native / Expo. The MVP is a menstrual cycle tracker where users log period dates and get cycle phase, ovulation window, and period predictions.

## Tech Stack

- **Framework**: Expo SDK ~52 + Expo Router v4 (file-based routing)
- **Language**: TypeScript (strict)
- **Backend / Auth / DB**: Supabase (email/password + PostgreSQL + Row Level Security)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Date logic**: `date-fns` v3 — always use this for date math, never native Date arithmetic
- **State**: React Context API + `useReducer` — no external state library
- **SVG**: `react-native-svg`
- **Font**: Space Grotesk via `@expo-google-fonts/space-grotesk`

## Key Architectural Decisions

- **Expo Router** for navigation — all routes live in `app/`, use file-based conventions
- **Auth guard** lives exclusively in `app/_layout.tsx` — do not add redirect logic elsewhere
- **Cycle calculations are pure functions** in `src/utils/cycleCalculations.ts` — no side effects, no Supabase calls, no React hooks. The hook `useCycleCalculations.ts` wraps them for component use.
- **Supabase client** is initialized once in `src/lib/supabase.ts` with AsyncStorage adapter — import from there everywhere, never re-initialize
- **Row Level Security** is enforced at the database level — always ensure new tables have RLS policies before writing any insert/select logic

## Folder Conventions

```
app/          Expo Router routes only — no business logic
src/
  components/ UI components only — no direct Supabase calls
  context/    AuthContext and CycleContext — data fetching + state
  hooks/      Thin wrappers over context or utils
  lib/        Singleton clients and constants (supabase.ts, constants.ts)
  types/      Shared TypeScript interfaces
  utils/      Pure functions (no React, no Supabase)
```

## Design System

Dark-first, bold & modern. Do not use soft pinks or light themes.

```
Background:  #0A0A0A
Surface:     #1C1C1E
Text:        #FFFFFF
Text muted:  #8E8E93

Phase colors:
  menstrual:  #FF3B30
  follicular: #FF9500
  ovulation:  #30D158
  luteal:     #BF5AF2
```

All colors and phase mappings are defined in `src/lib/constants.ts` — reference them from there, never hardcode hex values in components.

## Supabase Schema

Two tables: `profiles` (extends auth.users, stores cycle_length + period_length) and `period_logs` (start_date, end_date, notes per user). A Postgres trigger auto-creates a `profiles` row on signup.

Full schema SQL is in `README.md`.

## Cycle Calculation Rules

- Day 1 of cycle = period start date
- Phase boundaries (fixed, not proportional to cycle length):
  - Days 1–5: menstrual
  - Days 6–13: follicular
  - Days 14–16: ovulation
  - Days 17–N: luteal
  - Day > N: treat as menstrual (overdue)
- Next period = last period start + average cycle length (default 28)
- Ovulation peak = next period − 14 days
- Ovulation window = peak ± 1 day
- Average cycle length = mean of last 3 gaps between period start dates (minimum 2 logs required, else use profile default)

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

Prefix all client-side env vars with `EXPO_PUBLIC_`.

## Commands

```bash
npx expo start          # start dev server
npx expo start --ios    # open on iOS simulator
npx expo start --android # open on Android emulator
```
