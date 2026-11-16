import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Host, ProgressView } from '@expo/ui/swift-ui';
import { scaleEffect, tint } from '@expo/ui/swift-ui/modifiers';
import { Colors, Spacing } from '../theme/theme';

/**
 * Loader — shared loading indicator (native SwiftUI ProgressView on iOS).
 *
 * Props:
 *  size   {number}  – diameter in px (default: 44)
 *  color  {string}  – spinner colour (default: Colors.primary)
 *  style  {object}  – extra container overrides
 */
const DEFAULT_SPINNER = 20; // SwiftUI's default ProgressView diameter, scaled up to `size`

export default function Loader({ size = 44, color = Colors.primary, style }) {
  return (
    <View style={[styles.container, style]}>
      <Host style={{ width: size, height: size }}>
        <ProgressView modifiers={[tint(color), scaleEffect(size / DEFAULT_SPINNER)]} />
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
