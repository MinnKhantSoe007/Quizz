import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Host, Button, Icon } from '@expo/ui';
import { Colors, Spacing } from '../theme/theme';

/**
 * BackButton — shared back navigation control for all screens (native button:
 * SwiftUI on iOS, Jetpack Compose on Android).
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
    <View style={[styles.button, disabled && styles.disabled, style]}>
      <Host matchContents>
        <Button variant="text" onPress={handlePress} disabled={disabled}>
          <Icon
            name={{ ios: 'chevron.left', android: require('../../assets/icons/chevron_left.xml') }}
            size={iconSize}
            color={disabled ? Colors.textPlaceholder : Colors.textPrimary}
          />
        </Button>
      </Host>
    </View>
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
