import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { COLORS, PHASE_COLORS, PHASE_LABELS } from '../../lib/constants';
import { CyclePhase } from '../../types';

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
  const phases = getPhaseSegments(cycleLength);

  const clampedDay = Math.min(Math.max(currentDay, 1), cycleLength);
  // Position marker at the center of the current day slot
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
        {/* Today label + stem */}
        {barWidth > 0 && (
          <View style={[styles.markerWrapper, { left: markerLeft - 1 }]}>
            <Text style={styles.todayLabel}>Today</Text>
            <View style={styles.markerStem} />
          </View>
        )}

        {/* Phase segments */}
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

        {/* Today dot on the bar */}
        {barWidth > 0 && (
          <View
            style={[
              styles.markerDot,
              { left: markerLeft - 5 },
            ]}
          />
        )}
      </View>

      {/* Phase labels */}
      <View style={styles.labelRow}>
        {phases.map(({ phase, startDay, endDay }) => {
          const span = endDay - startDay + 1;
          const isActive = phase === currentPhase;
          return (
            <View key={phase} style={{ flex: span }}>
              <Text
                style={[
                  styles.phaseLabel,
                  isActive && { color: PHASE_COLORS[phase], fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {PHASE_LABELS[phase]}
              </Text>
              <Text style={styles.dayRange}>
                {startDay}–{endDay}
              </Text>
            </View>
          );
        })}
      </View>
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
    paddingTop: 28, // space for "Today" label above bar
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
    bottom: 4 + 2, // paddingBottom + half bar height offset
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
    fontWeight: '400',
    opacity: 0.6,
    marginTop: 1,
  },
});
