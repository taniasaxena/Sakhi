# Sakhi — Women's Health App

A one-stop app for women's health. MVP: menstrual cycle tracker.

---

## MVP Features

- Log period start and end dates
- See your current cycle phase (menstrual, follicular, ovulation, luteal)
- Predicted ovulation window
- Days until next period
- Full cycle history

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK ~52 + Expo Router v4 |
| Language | TypeScript |
| Backend / Auth / DB | Supabase (email/password auth + PostgreSQL + RLS) |
| Styling | NativeWind v4 (Tailwind for React Native) |
| Date logic | `date-fns` v3 |
| SVG | `react-native-svg` (cycle ring visualization) |
| State | React Context API + `useReducer` |
| Font | Space Grotesk (`@expo-google-fonts/space-grotesk`) |

---

## Folder Structure

```
Sakhi/
├── app.json
├── babel.config.js          # NativeWind plugin
├── metro.config.js          # withNativeWind wrapper
├── tailwind.config.js
├── tsconfig.json
├── .env                     # SUPABASE_URL, SUPABASE_ANON_KEY
│
├── app/
│   ├── _layout.tsx          # Root: AuthProvider + CycleProvider + auth guard
│   ├── index.tsx            # Redirect only
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/
│       ├── _layout.tsx      # 3-tab navigator
│       ├── dashboard.tsx    # Core screen
│       ├── log.tsx          # Log period
│       └── history.tsx      # Past cycles
│
└── src/
    ├── components/
    │   ├── ui/              # Button, Input, Card, Badge
    │   ├── dashboard/       # PhaseCard, CycleRing, StatRow, OvulationWindow
    │   ├── log/             # DatePickerField, PeriodForm
    │   └── history/         # CycleHistoryItem
    ├── context/
    │   ├── AuthContext.tsx
    │   └── CycleContext.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useCycles.ts
    │   └── useCycleCalculations.ts
    ├── lib/
    │   ├── supabase.ts      # Supabase client (AsyncStorage adapter)
    │   └── constants.ts     # PHASE_COLORS, BRAND_COLORS, defaults
    ├── types/
    │   └── index.ts
    └── utils/
        └── cycleCalculations.ts   # Pure cycle calculation functions
```

---

## Supabase Schema

### `profiles`
```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  cycle_length  INT NOT NULL DEFAULT 28,
  period_length INT NOT NULL DEFAULT 5,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id);
```

### `period_logs`
```sql
CREATE TABLE period_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date  DATE NOT NULL,
  end_date    DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX ON period_logs(user_id, start_date);
ALTER TABLE period_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own logs" ON period_logs FOR ALL USING (auth.uid() = user_id);
```

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Cycle Calculation Logic

All pure functions in `src/utils/cycleCalculations.ts`:

```
computeCycleInfo(logs, profile, today) → CycleInfo | null

  lastPeriodStart = most recent log start_date
  cycleLength     = average of last 3 cycle gaps (fallback: profile.cycle_length = 28)
  dayOfCycle      = differenceInDays(today, lastPeriodStart) + 1

  phase:
    days 1–5   → menstrual
    days 6–13  → follicular
    days 14–16 → ovulation
    days 17–N  → luteal
    day > N    → menstrual (overdue)

  nextPeriod      = addDays(lastPeriodStart, cycleLength)
  daysUntilNext   = max(0, differenceInDays(nextPeriod, today))
  ovulationPeak   = subDays(nextPeriod, 14)
  ovulWindow      = { start: peak - 1 day, end: peak + 1 day }
```

---

## Design System

Dark-first, bold & modern.

```
Background:  #0A0A0A   (near-black)
Surface:     #1C1C1E   (card)
Text:        #FFFFFF
Text muted:  #8E8E93

Phase colors:
  Menstrual:   #FF3B30  (vivid red)
  Follicular:  #FF9500  (bold orange)
  Ovulation:   #30D158  (electric green)
  Luteal:      #BF5AF2  (strong purple)
```

---

## Getting Started

### 1. Bootstrap

```bash
npx create-expo-app@latest Sakhi --template blank-typescript
```

Install dependencies:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
npm install nativewind tailwindcss date-fns react-native-svg
npx expo install @expo/vector-icons expo-font
npm install @expo-google-fonts/space-grotesk
```

### 2. Environment

Create `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase

- Create a project at supabase.com
- Run the SQL migrations above in the SQL editor
- Enable Email/Password auth under Authentication > Providers

### 4. Run

```bash
npx expo start
```

---

## Implementation Order

1. **Bootstrap** — Expo setup, install deps, configure NativeWind + Expo Router
2. **Supabase** — Run SQL migrations, configure client with AsyncStorage
3. **Types** — `src/types/index.ts` (PeriodLog, UserProfile, CyclePhase, CycleInfo)
4. **Auth layer** — AuthContext, sign-in/sign-up screens, root layout auth guard
5. **Calculation engine** — `src/utils/cycleCalculations.ts` pure functions
6. **Data layer** — CycleContext (fetchLogs, addLog, updateLog, deleteLog)
7. **UI components** — Base kit → dashboard components → log/history components
8. **Screens** — Dashboard → Log → History
9. **Polish** — Empty states, loading indicators, error handling, sign-out
