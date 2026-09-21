import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Shadow, Colors, FontFamily, FontSize, Radius, Spacing } from '../theme/theme';
import { usePulse } from '../hooks/usePulse';
import { getInitials } from '../utils/getInitials';

/**
 * CategoryCard — shared list-card used by question, category, and level screens.
 *
 * Props:
 *  title      {string}  – main line
 *  subtitle   {string}  – line under the title
 *  tag        {string}  – optional text pinned to the right
 *  badge      {string}  – optional text to derive initials for the left badge; omit to hide the badge
 *  highlighted {bool}   – animated glowing purple border, used to mark special (e.g. time-limited) items
 *  onPress    {func}    – press handler
 *  style      {object}  – extra container overrides
 */
export default function CategoryCard({ title, subtitle, tag, badge, highlighted = false, onPress, style }) {
  const glow = usePulse({ enabled: highlighted });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, highlighted && Shadow.floating, style]}
      activeOpacity={0.75}
    >
      {highlighted ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.glowBorder, { opacity: glow }]} />
      ) : null}

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
    ...Shadow.card,
  },

  glowBorder: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
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
