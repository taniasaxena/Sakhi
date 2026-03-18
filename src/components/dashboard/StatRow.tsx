import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../lib/constants';

interface StatRowProps {
  label: string;
  value: string;
  accent?: string;
}

export function StatRow({ label, value, accent }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accent ? { color: accent } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  value: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
