import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { format } from 'date-fns';
import { COLORS } from '../../lib/constants';
import { useCycle } from '../../context/CycleContext';
import { Button } from '../ui/Button';
import { DatePickerField } from './DatePickerField';

interface PeriodFormProps {
  onSuccess?: () => void;
}

export function PeriodForm({ onSuccess }: PeriodFormProps) {
  const { addLog } = useCycle();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!startDate) {
      setError('Please select a period start date.');
      return;
    }
    if (endDate && endDate < startDate) {
      setError('End date cannot be before start date.');
      return;
    }

    setError(null);
    setLoading(true);

    const err = await addLog(
      format(startDate, 'yyyy-MM-dd'),
      endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      notes.trim() || undefined
    );

    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      setStartDate(null);
      setEndDate(null);
      setNotes('');
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    }
  };

  return (
    <View style={styles.container}>
      <DatePickerField
        label="Period Start Date"
        value={startDate}
        onChange={setStartDate}
        maximumDate={new Date()}
      />

      <DatePickerField
        label="Period End Date"
        value={endDate}
        onChange={setEndDate}
        optional
        minimumDate={startDate ?? undefined}
        maximumDate={new Date()}
      />

      <View style={styles.notesWrapper}>
        <Text style={styles.notesLabel}>Notes (optional)</Text>
        <TextInput
          style={styles.notes}
          value={notes}
          onChangeText={setNotes}
          placeholder="How are you feeling?"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.successText}>Period logged successfully!</Text>}

      <Button label="Save Period" onPress={handleSave} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  notesWrapper: {
    gap: 6,
  },
  notesLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  notes: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 90,
  },
  error: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#30D158',
    fontSize: 14,
    fontWeight: '600',
  },
});
