import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Spacing } from "../../theme/theme";
import { DIMENSIONS } from "../../utils/constant";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },

  illustration: {
    width: DIMENSIONS.width * 0.85,
    height: DIMENSIONS.width * 0.75,
  },

  textBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },

  headline: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  subheadline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    paddingHorizontal: Spacing.md,
  },

  buttonBlock: {
    width: '100%',
  },

  btnSpacer: {
    height: Spacing.md,
  },
});