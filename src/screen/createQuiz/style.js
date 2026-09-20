import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionInput: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  removeOption: {
    height: 52,
    paddingLeft: Spacing.md,
    justifyContent: 'center',
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  addOptionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.textPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  radioTextActive: {
    color: Colors.primary,
  },
  levelSelect: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCol: {
    width: '48%',
  },
  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  timeFieldDisabled: {
    backgroundColor: Colors.searchBackground,
  },
  timeText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  timePlaceholder: {
    color: Colors.textPlaceholder,
  },
  createButton: {
    marginTop: Spacing.lg,
  },
});
