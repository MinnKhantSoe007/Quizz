import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme/theme';

/**
 * BackButton — shared back navigation control for all screens.
 *
 * Props:
 *  onPress        {func}    – custom press handler (defaults to navigation.goBack())
 *  disabled       {bool}    – disables press & dims appearance
 *  fallbackRoute  {string}  – screen name when goBack is unavailable
 *  style          {object}  – extra container overrides
 *  iconSize       {number}  – chevron icon size (default: 28)
 */
export default function BackButton({
  onPress,
  disabled = false,
  fallbackRoute,
  style,
  iconSize = 28,
}) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (fallbackRoute) {
      navigation.navigate(fallbackRoute);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.75}
    >
      <Ionicons
        name="chevron-back-outline"
        size={iconSize}
        color={disabled ? Colors.textPlaceholder : Colors.textPrimary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    padding: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
