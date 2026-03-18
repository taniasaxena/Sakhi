import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { differenceInDays, format, parseISO } from 'date-fns';
import { COLORS } from '../../lib/constants';
import { useCycle } from '../../context/CycleContext';
import { PeriodLog } from '../../types';

interface CycleHistoryItemProps {
  log: PeriodLog;
  cycleLength?: number;
}

export function CycleHistoryItem({ log, cycleLength }: CycleHistoryItemProps) {
  const { deleteLog } = useCycle();

  const start = parseISO(log.start_date);
  const end = log.end_date ? parseISO(log.end_date) : null;
  const duration = end ? differenceInDays(end, start) + 1 : null;

  const handleDelete = () => {
    Alert.alert('Delete Period Log', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteLog(log.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.date}>{format(start, 'MMM d, yyyy')}</Text>
        <View style={styles.meta}>
          {end ? (
            <Text style={styles.metaText}>
              {format(start, 'MMM d')} – {format(end, 'MMM d')} · {duration} days
            </Text>
          ) : (
            <Text style={[styles.metaText, { color: COLORS.danger }]}>Ongoing</Text>
          )}
          {cycleLength && (
            <Text style={styles.cycleText}>Cycle: {cycleLength} days</Text>
          )}
        </View>
        {log.notes && <Text style={styles.notes}>{log.notes}</Text>}
      </View>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  date: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  cycleText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  notes: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
