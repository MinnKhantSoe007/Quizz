import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
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
 *  value     {any}     – currently active option's value, shown with a filled radio
 *  onSelect  {func}    – called with the selected option's value
 *  onClear   {func}    – called when "Clear" is pressed
 */
export default function SortSheet({ visible, onClose, title = 'Sort By', options, value, onSelect, onClear }) {
  return (
    <BottomSheet
      index={visible ? 0 : -1}
      enableDynamicSizing
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>

        {options.map((option) => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <View style={styles.radioOuter}>{selected ? <View style={styles.radioInner} /> : null}</View>
            </TouchableOpacity>
          );
        })}

        <AppButton label="Clear" onPress={onClear} variant="outline" style={styles.clearButton} />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: Spacing.lg,
  },

  title: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  optionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  clearButton: {
    width: '100%',
    marginTop: Spacing.md,
  },
});
