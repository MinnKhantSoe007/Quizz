import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';
import AppButton from './AppButton';

/**
 * SortSheet — shared "Sort By" bottom sheet used by question, category, and level screens.
 *
 * Props:
 *  visible   {bool}    – sheet visibility
 *  onClose   {func}    – backdrop / hardware-back dismiss handler
 *  title     {string}  – sheet heading (default: 'Sort By')
 *  options   {Array<{ label: string, value: any }>} – tappable sort options
 *  onSelect  {func}    – called with the selected option's value
 *  onClear   {func}    – called when "Clear" is pressed
 */
export default function SortSheet({ visible, onClose, title = 'Sort By', options, onSelect, onClear }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          {options.map((option) => (
            <TouchableOpacity key={option.value} onPress={() => onSelect(option.value)}>
              <Text style={styles.option}>{option.label}</Text>
            </TouchableOpacity>
          ))}

          <AppButton label="Clear" onPress={onClear} variant="outline" style={styles.clearButton} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },

  sheet: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  option: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  clearButton: {
    width: '100%',
    marginTop: Spacing.sm,
  },
});
