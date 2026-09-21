import { StyleSheet } from "react-native";
import { Shadow, Colors, FontFamily, FontSize, Radius, Spacing } from "../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  welcomeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },

  listContainer: {
    flex: 1,
    marginBottom: Spacing.xxl,
  },

  listContent: {
    paddingBottom: Spacing.xxl,
  },

  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },

  loader: {
    marginTop: Spacing.xxl,
  },

  emptyText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },

  sheetOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },

  addModalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
  },

  addModalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  listLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  categoryList: {
    maxHeight: 180,
    marginBottom: Spacing.lg,
  },

  categoryOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },

  categoryOptionSelected: {
    backgroundColor: Colors.primaryHighlight,
  },

  categoryOptionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  categoryOptionTextSelected: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },

  modalActionButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
});