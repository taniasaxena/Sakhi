import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, PHASE_COLORS, PHASE_DESCRIPTIONS, PHASE_LABELS } from '../../lib/constants';
import { CyclePhase } from '../../types';

interface PhaseCardProps {
  phase: CyclePhase;
  dayOfCycle: number;
  cycleLength: number;
}

export function PhaseCard({ phase, dayOfCycle, cycleLength }: PhaseCardProps) {
  const color = PHASE_COLORS[phase];

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.phaseName, { color }]}>{PHASE_LABELS[phase]}</Text>
      <Text style={styles.description}>{PHASE_DESCRIPTIONS[phase]}</Text>
      <Text style={styles.dayCounter}>
        Day <Text style={[styles.dayNumber, { color }]}>{dayOfCycle}</Text>
        <Text style={styles.dayTotal}> / {cycleLength}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1.5,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  dayCounter: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  dayTotal: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
});
