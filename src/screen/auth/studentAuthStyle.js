import { StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Spacing } from "../../theme/theme";
import { DIMENSIONS } from "../../utils/constant";

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

    logoWrapper: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },

    logo: {
        width: DIMENSIONS.width * 0.5,
        height: DIMENSIONS.width * 0.5,
    },

    title: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.xl,
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },

    forgotLink: {
        alignSelf: 'flex-start',
        marginBottom: Spacing.lg,
    },

    forgotText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Colors.link,
    },

    actionButton: {
        width: '100%',
    },

    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.divider,
    },

    dividerText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginHorizontal: Spacing.sm,
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
