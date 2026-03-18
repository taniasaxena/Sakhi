import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS, PHASE_COLORS } from '../../lib/constants';
import { CyclePhase } from '../../types';

interface CycleRingProps {
  currentDay: number;
  cycleLength: number;
  phase: CyclePhase;
}

export function CycleRing({ currentDay, cycleLength, phase }: CycleRingProps) {
  const size = 200;
  const cx = 100;
  const cy = 100;
  const r = 82;
  const strokeWidth = 10;
  const color = PHASE_COLORS[phase];

  const progress = Math.min(currentDay / cycleLength, 1);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + progress * 2 * Math.PI;

  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);

  const largeArc = progress > 0.5 ? 1 : 0;

  // Full circle edge case
  const arcPath =
    progress >= 0.9999
      ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`
      : `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={COLORS.surfaceElevated}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        {progress > 0 && (
          <Path
            d={arcPath}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </Svg>
      <View style={styles.centerLabel} pointerEvents="none">
        <Text style={[styles.dayNum, { color }]}>{currentDay}</Text>
        <Text style={styles.dayWord}>of {cycleLength} days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  dayNum: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
  },
  dayWord: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
