import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { differenceInDays, parseISO } from 'date-fns';
import { COLORS } from '../../src/lib/constants';
import { useCycle } from '../../src/context/CycleContext';
import { CycleHistoryItem } from '../../src/components/history/CycleHistoryItem';
import { PeriodLog } from '../../src/types';

export default function HistoryScreen() {
  const { periodLogs, loading, fetchData } = useCycle();

  // Compute cycle length for each log (gap to next period)
  const logsWithCycleLength = periodLogs.map((log, index) => {
    const next = periodLogs[index - 1]; // logs are desc order
    const cycleLength = next
      ? differenceInDays(parseISO(next.start_date), parseISO(log.start_date))
      : undefined;
    return { log, cycleLength };
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.count}>
          {periodLogs.length} {periodLogs.length === 1 ? 'cycle' : 'cycles'} logged
        </Text>
      </View>

      {loading && periodLogs.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.text} />
        </View>
      ) : (
        <FlatList
          data={logsWithCycleLength}
          keyExtractor={(item) => item.log.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchData}
              tintColor={COLORS.text}
            />
          }
          renderItem={({ item }) => (
            <CycleHistoryItem log={item.log} cycleLength={item.cycleLength} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No cycles logged yet</Text>
              <Text style={styles.emptyBody}>
                Head to the Log tab to start tracking your cycle.
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  count: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyBody: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
