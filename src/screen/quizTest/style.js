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
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
        marginBottom: Spacing.lg,
    },

    headerTitle: {
        flex: 1,
        fontFamily: FontFamily.bold,
        fontSize: FontSize.xl,
        color: Colors.primary,
        textAlign: 'center',
        marginHorizontal: Spacing.sm,
    },

    card: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        elevation: 2,
    },

    timerText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.md,
        color: Colors.warning,
        textAlign: 'right',
        marginBottom: Spacing.md,
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },

    questionCount: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.sm,
        color: Colors.primary,
    },

    levelText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    questionText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.lg,
        color: Colors.textPrimary,
        marginBottom: Spacing.lg,
    },

    rippleWrapper: {
        borderRadius: Radius.md,
    },

    answer_container: {
        padding: Spacing.md,
        backgroundColor: Colors.searchBackground,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },

    selected_option_container: {
        padding: Spacing.md,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },

    correct_answer_container: {
        padding: Spacing.md,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },

    wrong_answer_container: {
        padding: Spacing.md,
        backgroundColor: Colors.error,
        borderRadius: Radius.md,
        marginBottom: Spacing.md,
    },

    answer: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },

    answerSelected: {
        color: Colors.white,
    },

    reasonText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.sm,
    },

    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.lg,
    },

    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },

    navButtonText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },

    navButtonTextPrimary: {
        color: Colors.primary,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        marginTop: 30,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 9,
    },

    result_text: {
        fontFamily: FontFamily.bold,
        fontSize: 24,
    },

    result_button: {
        fontFamily: FontFamily.bold,
        marginTop: 10,
        fontSize: 20,
        color: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    img_congraz: {
        width: 100,
        height: 100,
    },

    img_container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },

    scoreText: (isPass) => {
        return {
          fontSize: 22,
          color: isPass ? Colors.success : Colors.error,
        }
    },

    sure_text: {
        fontFamily: FontFamily.bold,
        fontSize: 20,
        marginBottom: 10
    },

    loose_text: {
        fontFamily: FontFamily.regular,
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center"
    },

    yes: {
        marginTop: 10,
        fontFamily: FontFamily.bold,
        fontSize: 18,
        color: Colors.success,
        marginHorizontal: 40,
    },

    no: {
        marginTop: 10,
        fontFamily: FontFamily.bold,
        fontSize: 18,
        color: Colors.error,
        marginHorizontal: 40,
    },

})
