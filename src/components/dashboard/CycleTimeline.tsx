import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, PHASE_COLORS, PHASE_DETAIL, PHASE_LABELS } from '../../lib/constants';
import { CyclePhase } from '../../types';

const CYCLE_PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

interface PhaseSegment {
  phase: CyclePhase;
  startDay: number;
  endDay: number;
}

function getPhaseSegments(cycleLength: number): PhaseSegment[] {
  return [
    { phase: 'menstrual', startDay: 1, endDay: 5 },
    { phase: 'follicular', startDay: 6, endDay: 13 },
    { phase: 'ovulation', startDay: 14, endDay: 16 },
    { phase: 'luteal', startDay: 17, endDay: cycleLength },
  ];
}

interface CycleTimelineProps {
  currentDay: number;
  cycleLength: number;
  currentPhase: CyclePhase;
}

export function CycleTimeline({ currentDay, cycleLength, currentPhase }: CycleTimelineProps) {
  const [barWidth, setBarWidth] = useState(0);
  const [legendOpen, setLegendOpen] = useState(false);
  const phases = getPhaseSegments(cycleLength);

  const clampedDay = Math.min(Math.max(currentDay, 1), cycleLength);
  const markerLeft = barWidth > 0
    ? ((clampedDay - 0.5) / cycleLength) * barWidth
    : 0;

  const onBarLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Full Cycle</Text>

      {/* Bar + Today marker */}
      <View style={styles.markerArea} onLayout={onBarLayout}>
        {barWidth > 0 && (
          <View style={[styles.markerWrapper, { left: markerLeft - 1 }]}>
            <Text style={styles.todayLabel}>Today</Text>
            <View style={styles.markerStem} />
          </View>
        )}

        <View style={styles.bar}>
          {phases.map(({ phase, startDay, endDay }) => {
            const span = endDay - startDay + 1;
            const isActive = phase === currentPhase;
            return (
              <View
                key={phase}
                style={[
                  styles.segment,
                  {
                    flex: span,
                    backgroundColor: PHASE_COLORS[phase],
                    opacity: isActive ? 1 : 0.25,
                  },
                ]}
              />
            );
          })}
        </View>

        {barWidth > 0 && (
          <View style={[styles.markerDot, { left: markerLeft - 5 }]} />
        )}
      </View>

      {/* Phase day-range labels */}
      <View style={styles.labelRow}>
        {phases.map(({ phase, startDay, endDay }) => {
          const span = endDay - startDay + 1;
          const isActive = phase === currentPhase;
          return (
            <View key={phase} style={{ flex: span }}>
              <Text
                style={[styles.phaseLabel, isActive && { color: PHASE_COLORS[phase], fontWeight: '800' }]}
                numberOfLines={1}
              >
                {PHASE_LABELS[phase]}
              </Text>
              <Text style={styles.dayRange}>{startDay}–{endDay}</Text>
            </View>
          );
        })}
      </View>

      {/* Divider + legend toggle */}
      <View style={styles.divider} />

      <TouchableOpacity onPress={() => setLegendOpen(o => !o)} style={styles.legendToggle} activeOpacity={0.7}>
        <Text style={styles.legendHeading}>What each phase means</Text>
        <Text style={styles.chevron}>{legendOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {legendOpen && <View style={styles.legend}>
        {CYCLE_PHASES.map((phase) => {
          const { days, what } = PHASE_DETAIL[phase];
          const isActive = phase === currentPhase;
          return (
            <View
              key={phase}
              style={[
                styles.legendItem,
                isActive && { borderColor: PHASE_COLORS[phase] + '60', backgroundColor: PHASE_COLORS[phase] + '12' },
              ]}
            >
              <View style={styles.legendLeft}>
                <View style={[styles.legendDot, { backgroundColor: PHASE_COLORS[phase] }]} />
              </View>
              <View style={styles.legendText}>
                <View style={styles.legendTitleRow}>
                  <Text style={[styles.legendPhase, isActive && { color: PHASE_COLORS[phase] }]}>
                    {PHASE_LABELS[phase]}
                  </Text>
                  {isActive && <Text style={[styles.currentBadge, { color: PHASE_COLORS[phase], borderColor: PHASE_COLORS[phase] + '60' }]}>You are here</Text>}
                  <Text style={styles.legendDays}>{days}</Text>
                </View>
                <Text style={styles.legendWhat}>{what}</Text>
              </View>
            </View>
          );
        })}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  heading: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  markerArea: {
    position: 'relative',
    paddingTop: 28,
    paddingBottom: 4,
  },
  bar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  segment: {
    height: 14,
  },
  markerWrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: 2,
  },
  todayLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  markerStem: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.text,
    borderRadius: 1,
  },
  markerDot: {
    position: 'absolute',
    bottom: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  labelRow: {
    flexDirection: 'row',
  },
  phaseLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  dayRange: {
    color: COLORS.textMuted,
    fontSize: 10,
    opacity: 0.6,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  legendToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendHeading: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendLeft: {
    paddingTop: 3,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    gap: 4,
  },
  legendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  legendPhase: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  currentBadge: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  legendDays: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  legendWhat: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
});
