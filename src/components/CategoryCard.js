import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';
import { getInitials } from '../utils/getInitials';

/**
 * CategoryCard — shared list-card used by question, category, and level screens.
 *
 * Props:
 *  title      {string}  – main line
 *  subtitle   {string}  – line under the title
 *  tag        {string}  – optional text pinned to the right
 *  badge      {string}  – optional text to derive initials for the left badge; omit to hide the badge
 *  onPress    {func}    – press handler
 *  style      {object}  – extra container overrides
 */
export default function CategoryCard({ title, subtitle, tag, badge, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]} activeOpacity={0.75}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getInitials(badge)}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {tag ? (
        <Text style={styles.tag} numberOfLines={1}>
          {tag}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    elevation: 3,
  },

  badge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  tag: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.primary,
    maxWidth: 90,
    textAlign: 'right',
  },
});
