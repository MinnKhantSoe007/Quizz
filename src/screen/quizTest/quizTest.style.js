import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    quiz_container: {
        flex: 1
    },

    number: {
        color: 'grey',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
    },

    question: {
        textAlign: 'center',
        fontSize: 25,
        marginHorizontal: 25,
        letterSpacing: 2,
    },

    flatList: {
        position: 'relative',
        marginTop: 35,
    },

    answer_container: {

        padding: 10,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00000015',
    },

    answer: {
        fontSize: 16,
        color: '#000',
        textAlignVertical: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },

    continue_btn_container: {
        marginTop: 130
    },

    continue_btn: {
        fontSize: 20,
        backgroundColor: '#5E60CE',
        paddingVertical: 13,
        borderRadius: 10,
        textAlign: 'center',
    },

    continue_arrow: {
        color: '#000',
        left: 300,
        bottom: 43,
        position: 'relative',
    },

    correct_logo: {
        alignItems: 'flex-end',
        position: 'relative',
        bottom: 40
    },

    wrong_logo: {
        alignItems: 'flex-end',
        position: 'relative',
        bottom: 40
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        marginTop: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
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
        fontSize: 24,
    },

    result_score: {
        color: 'grey',
        fontSize: 22,
        marginHorizontal: 3
    },

    bottom_result_score: {
        color: 'green',
        fontSize: 22,
    },

    result_button: {
        marginTop: 10,
        fontSize: 20,
        color: '#000',
        backgroundColor: '#5E60CE',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    img_congraz: {
        width: 100,
        height: 100,
    },

    img_loose: {
        width: 100,
        height: 100,
    },

    img_container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    indicatorStyle: (isActive) => {
        return {
            margin: 10,
            width: 30,
            height: 30,
            borderRadius: 20,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#5E60CE55',
            backgroundColor: isActive ? '#fff' : '#5E60CE'

        }
    },
    indicatorText: (isActive) => {
        return {
            fontSize:12,
            color: isActive ? '#5E60CE' : '#fff',
            textAlign: 'center',
            fontWeight: 'bold'
        }
    }
})