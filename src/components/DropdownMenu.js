import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * DropdownMenu — shared avatar-tap menu, anchored top-right, used by
 * question.js and category.js.
 *
 * Props:
 *  visible  {bool}    – menu visibility
 *  onClose  {func}    – backdrop / hardware-back dismiss handler
 *  items    {Array<{ label: string, onPress: func, danger?: bool }>}
 */
export default function DropdownMenu({ visible, onClose, items }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.card}>
        {items.map((item) => (
          <TouchableOpacity key={item.label} style={styles.item} onPress={item.onPress} activeOpacity={0.75}>
            <Text style={[styles.itemText, item.danger && styles.itemTextDanger]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },

  card: {
    position: 'absolute',
    top: 84,
    right: Spacing.lg,
    minWidth: 190,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  item: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },

  itemText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  itemTextDanger: {
    color: Colors.error,
  },
});
