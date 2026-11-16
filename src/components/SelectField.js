import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@expo/ui/community/picker';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * SelectField — labelled dropdown (native Picker: wheel on iOS, Material 3
 * dropdown field on Android — the latter already draws its own outline, so
 * it isn't framed in an extra box like the iOS wheel is).
 * items: [{ label, value }]. `placeholder` adds a greyed empty first item.
 */
export default function SelectField({ label, value, onChange, items, placeholder, disabled = false, style }) {
  const picker = (
    <Picker
      style={styles.picker}
      selectedValue={value}
      onValueChange={onChange}
      enabled={!disabled}
    >
      {placeholder ? <Picker.Item label={placeholder} value="" color={Colors.textPlaceholder} /> : null}
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  );

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {Platform.OS === 'ios' ? (
        <View style={[styles.box, disabled && styles.disabled]}>{picker}</View>
      ) : (
        picker
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  picker: {
    width: '100%', // Android's dropdown field wraps to content width unless told to fill
  },
  box: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  disabled: {
    backgroundColor: Colors.searchBackground,
  },
});
