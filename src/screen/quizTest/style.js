import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    quiz_container: {
        flex: 1,
        marginTop: 60
    },

    number: {
        fontFamily: 'RobotoBold',
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

    correct_answer_container: {

        padding: 10,
        backgroundColor: '#52b788',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#52b788',
    },

    wrong_answer_container: {

        padding: 10,
        backgroundColor: '#dc2f02',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dc2f02',
    },

    answer: {
        fontFamily: 'RobotoRegular',
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
        fontFamily: 'RobotoBold',
        fontSize: 20,
        color: '#5E60CE',
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
        fontFamily: 'RobotoBold',
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
        fontFamily: 'RobotoBold',
        marginTop: 10,
        fontSize: 20,
        color: '#5E60CE',
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
            margin: 12,
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
    },


    scoreText: (isPass) => {
        return {
          fontSize: 22,
          color: isPass ? '#52b788' : '#dc2f02',
        }
    },
    
    back: {
        position: 'absolute',
        top: -30,
        left: 10,
        color: '#000',
    },
    
    sure_text: {
        fontFamily: 'RobotoBold',
        fontSize: 20,
        marginBottom: 10
    },

    loose_text: {
        fontFamily: 'RobotoRegular',
        fontSize: 16,
        marginBottom: 10
    },

    yes: {
        marginTop: 10,
        fontFamily: 'RobotoBold',
        fontSize: 18,
        color: '#52b788',
        marginHorizontal: 40,
    },

    no: {
        marginTop: 10,
        fontFamily: 'RobotoBold',
        fontSize: 18,
        color: '#dc2f02',
        marginHorizontal: 40,
    },

    timerContainer: {
        alignSelf: 'center',
        position: 'absolute',
        top: -30
    },
    

    timerText: {
        fontFamily: 'RobotoBold',
        fontSize: 20,
        color: '#000',
    },
    
    sound_logo: {
        position: 'relative',
        left: 345,
        top: -25
    }


})