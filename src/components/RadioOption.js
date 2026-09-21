import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/** RadioOption — one labelled radio. Group them yourself; `active` marks the selected one. */
export default function RadioOption({ label, active, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.row, style]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.circle, active && styles.circleActive]}>
        {active && <View style={styles.dot} />}
      </View>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.textPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  circleActive: {
    borderColor: Colors.primary,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  text: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  textActive: {
    color: Colors.primary,
  },
});
