import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * Toast — lightweight, non-blocking message pill. Pair with the useToast
 * hook, which owns the message + auto-dismiss timing.
 *
 * ponytail: positioned a fixed distance from the screen bottom, doesn't
 * shift above an open keyboard. Add keyboard-aware offset if a form screen
 * needs to show a toast while a field is focused.
 */
export default function Toast({ message }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) setDisplayMessage(message);

    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [message, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{displayMessage}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  text: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.black,
    textAlign: 'center',
  },
});
