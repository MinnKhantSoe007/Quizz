import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../theme/theme';

/**
 * AvatarPicker — shared profile-photo circle + edit badge used by
 * CreateAccount and UpdateAccount. Pair with the useImagePicker hook.
 *
 * Props:
 *  uri       {string}  – image to display; shows a placeholder icon when empty
 *  onPress   {func}    – opens the image picker
 *  disabled  {bool}    – disables the edit badge
 *  size      {number}  – avatar diameter (default: 120)
 */
export default function AvatarPicker({ uri, onPress, disabled = false, size = 120 }) {
  const circle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={styles.wrapper}>
      {uri ? (
        <Image source={{ uri }} style={circle} />
      ) : (
        <View style={[styles.placeholder, circle]}>
          <Ionicons name="person" size={size * 0.4} color={Colors.textPlaceholder} />
        </View>
      )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.75}
      >
        <Ionicons name="pencil" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },

  placeholder: {
    backgroundColor: Colors.searchBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
});
