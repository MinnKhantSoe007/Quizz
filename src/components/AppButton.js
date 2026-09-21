import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * AppButton — shared button component used across all screens.
 *
 * Props:
 *  label       {string}   – button text
 *  onPress     {func}     – press handler
 *  variant     {'filled'|'outline'|'ghost'}  – visual style (default: 'filled')
 *  disabled    {bool}     – disables press & dims appearance
 *  loading     {bool}     – shows a spinner instead of label
 *  style       {object}   – extra container overrides
 *  textStyle   {object}   – extra label overrides
 *  color       {string}   – override the primary colour
 */
export default function AppButton({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  loading = false,
  style,
  textStyle,
  color = Colors.primary,
}) {
  const isFilled  = variant === 'filled';
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';

  const containerStyle = [
    styles.base,
    isFilled  && { backgroundColor: color },
    isOutline && { backgroundColor: 'transparent', borderWidth: 2, borderColor: color },
    isGhost   && { backgroundColor: 'transparent' },
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    isFilled  && { color: Colors.white },
    isOutline && { color: color },
    isGhost   && { color: color },
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={containerStyle}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? Colors.white : color} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});
