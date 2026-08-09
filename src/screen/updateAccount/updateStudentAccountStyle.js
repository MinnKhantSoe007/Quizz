import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Spacing } from "../../theme/theme";

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

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  actionButton: {
    width: '100%',
  },

  loader: {
    marginVertical: Spacing.xl,
  },

  noText: {
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
});
