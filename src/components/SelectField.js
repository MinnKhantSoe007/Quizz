import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * SelectField — labelled, bordered dropdown (native Picker).
 * items: [{ label, value }]. `placeholder` adds a greyed empty first item.
 */
export default function SelectField({ label, value, onChange, items, placeholder, disabled = false, style }) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, disabled && styles.disabled]}>
        <Picker selectedValue={value} onValueChange={onChange} enabled={!disabled}>
          {placeholder ? <Picker.Item label={placeholder} value="" color={Colors.textPlaceholder} /> : null}
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
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
