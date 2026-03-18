import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';
import { useCycle } from '../../src/context/CycleContext';
import { useAuth } from '../../src/context/AuthContext';
import { useCycleCalculations } from '../../src/hooks/useCycleCalculations';
import { PhaseCard } from '../../src/components/dashboard/PhaseCard';
import { CycleRing } from '../../src/components/dashboard/CycleRing';
import { StatRow } from '../../src/components/dashboard/StatRow';
import { OvulationWindow } from '../../src/components/dashboard/OvulationWindow';

export default function DashboardScreen() {
  const { loading, fetchData } = useCycle();
  const { signOut, user } = useAuth();
  const cycleInfo = useCycleCalculations();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          tintColor={COLORS.text}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>sakhi</Text>
          <Text style={styles.subtitle}>your cycle, your power</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {loading && !cycleInfo ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.text} />
        </View>
      ) : cycleInfo ? (
        <>
          {/* Phase hero */}
          <PhaseCard
            phase={cycleInfo.currentPhase}
            dayOfCycle={cycleInfo.currentDayOfCycle}
            cycleLength={cycleInfo.cycleLength}
          />

          {/* Cycle ring */}
          <View style={styles.ringWrapper}>
            <CycleRing
              currentDay={cycleInfo.currentDayOfCycle}
              cycleLength={cycleInfo.cycleLength}
              phase={cycleInfo.currentPhase}
            />
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <StatRow
              label="Next period in"
              value={
                cycleInfo.daysUntilNextPeriod === 0
                  ? 'Today'
                  : `${cycleInfo.daysUntilNextPeriod} days`
              }
              accent={
                cycleInfo.daysUntilNextPeriod <= 3 ? COLORS.danger : undefined
              }
            />
            <StatRow
              label="Expected date"
              value={format(cycleInfo.predictedNextPeriodDate, 'MMM d, yyyy')}
            />
            <StatRow
              label="Cycle length"
              value={`${cycleInfo.cycleLength} days`}
            />
          </View>

          {/* Ovulation window */}
          <OvulationWindow
            start={cycleInfo.ovulationWindowStart}
            end={cycleInfo.ovulationWindowEnd}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌸</Text>
          <Text style={styles.emptyTitle}>Log your first period</Text>
          <Text style={styles.emptyBody}>
            Start tracking to see your cycle phases, ovulation window, and period predictions.
          </Text>
          <TouchableOpacity
            style={styles.logBtn}
            onPress={() => router.push('/(tabs)/log')}
            activeOpacity={0.8}
          >
            <Text style={styles.logBtnText}>Log Period</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  appName: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  signOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  signOutText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  centered: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  emptyBody: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  logBtn: {
    marginTop: 8,
    backgroundColor: COLORS.text,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  logBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
