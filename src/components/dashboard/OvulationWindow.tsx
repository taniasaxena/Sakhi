import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { COLORS, PHASE_COLORS } from '../../lib/constants';

interface OvulationWindowProps {
  start: Date;
  end: Date;
}

export function OvulationWindow({ start, end }: OvulationWindowProps) {
  const color = PHASE_COLORS.ovulation;

  return (
    <View style={[styles.container, { borderColor: color + '40' }]}>
      <View style={styles.left}>
        <View style={[styles.iconDot, { backgroundColor: color }]} />
        <Text style={styles.title}>Ovulation Window</Text>
      </View>
      <Text style={[styles.dates, { color }]}>
        {format(start, 'MMM d')} – {format(end, 'MMM d')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  dates: {
    fontSize: 14,
    fontWeight: '700',
  },
});
