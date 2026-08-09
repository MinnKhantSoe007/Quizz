import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';

/**
 * ConfirmDialog — shared "Are you sure?" confirm card, used for actions like
 * deleting a profile or signing out.
 *
 * Props:
 *  visible       {bool}    – dialog visibility
 *  title         {string}  – heading (default: 'Are you sure?')
 *  message       {string}  – supporting text
 *  confirmLabel  {string}  – confirm button text (default: 'Confirm')
 *  cancelLabel   {string}  – cancel button text (default: 'Cancel')
 *  destructive   {bool}    – colors the confirm label red
 *  onConfirm     {func}    – confirm handler
 *  onCancel      {func}    – cancel / backdrop dismiss handler
 */
export default function ConfirmDialog({
  visible,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onConfirm} activeOpacity={0.75}>
              <Text style={[styles.actionText, destructive && styles.destructiveText]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} activeOpacity={0.75}>
              <Text style={styles.actionText}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  message: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  actions: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },

  actionText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  destructiveText: {
    color: Colors.error,
  },
});
