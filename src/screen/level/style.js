import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../../theme/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },

  listContainer: {
    flex: 1,
    marginBottom: Spacing.xxl,
  },

  listContent: {
    paddingBottom: Spacing.xxl,
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

  historyFab: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
});
