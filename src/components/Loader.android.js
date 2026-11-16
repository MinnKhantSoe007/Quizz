import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Host, CircularProgressIndicator } from '@expo/ui/jetpack-compose';
import { size as sizeModifier } from '@expo/ui/jetpack-compose/modifiers';
import { Colors, Spacing } from '../theme/theme';

/**
 * Loader — shared loading indicator (native Compose CircularProgressIndicator on Android).
 *
 * Props:
 *  size   {number}  – diameter in dp (default: 44)
 *  color  {string}  – spinner colour (default: Colors.primary)
 *  style  {object}  – extra container overrides
 */
export default function Loader({ size = 44, color = Colors.primary, style }) {
  return (
    <View style={[styles.container, style]}>
      <Host style={{ width: size, height: size }}>
        <CircularProgressIndicator color={color} modifiers={[sizeModifier(size, size)]} />
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
});
