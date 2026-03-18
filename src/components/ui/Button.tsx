import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS } from '../../lib/constants';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'ghost';
  loading?: boolean;
  color?: string;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  color,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const bgColor = color ?? COLORS.text;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary'
          ? [styles.primary, { backgroundColor: bgColor }]
          : styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.background : COLORS.text} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary'
              ? { color: COLORS.background }
              : { color: COLORS.text },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: COLORS.text,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
