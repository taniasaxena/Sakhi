import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { COLORS } from '../../lib/constants';

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  optional?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerField({
  label,
  value,
  onChange,
  optional = false,
  maximumDate,
  minimumDate,
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(selected);
  };

  const displayDate = value ? format(value, 'MMMM d, yyyy') : optional ? 'Not set' : 'Select date';

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {optional && <Text style={styles.optional}> (optional)</Text>}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => setShow(true)} activeOpacity={0.7}>
        <Text style={[styles.dateText, !value && styles.placeholder]}>{displayDate}</Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {optional && value && (
        <TouchableOpacity onPress={() => onChange(null)} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      )}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate ?? new Date()}
          minimumDate={minimumDate}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <Pressable style={styles.overlay} onPress={() => setShow(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text style={styles.doneBtn}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={value ?? new Date()}
              mode="date"
              display="spinner"
              onChange={handleChange}
              maximumDate={maximumDate ?? new Date()}
              minimumDate={minimumDate}
              textColor={COLORS.text}
              style={{ backgroundColor: COLORS.surface }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  optional: {
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
  },
  button: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  icon: {
    fontSize: 18,
  },
  clearBtn: {
    alignSelf: 'flex-end',
  },
  clearText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  doneBtn: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
