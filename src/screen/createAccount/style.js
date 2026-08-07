import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
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

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
    textAlign: 'center',
  },

  createButton: {
    marginTop: Spacing.md,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  modalCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },

  modalSuccess: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  modalMessage: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  modalButton: {
    width: '100%',
  },
});