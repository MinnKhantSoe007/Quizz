import { StatusBar } from "expo-status-bar"
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Modal } from "react-native"
import { styles } from "./style"
import { Ionicons } from '@expo/vector-icons';
import { DATA } from '../../data/quizData';
import { useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function Quiz({ navigation }) {

  const allQuestions = DATA;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [continueButton, setContinueButton] = useState(false);
  const [scoreModal, setScoreModal] = useState(false)

  const validateAnswer = (selectedOption) => {
    const correct_option = allQuestions[currentQuestionIndex]['correct_option'];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionDisabled(true);

    if (selectedOption == correct_option) {
      setScore(score + 1);
    }

    setContinueButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex == allQuestions.length - 1) {
      setScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionDisabled(false);
      setContinueButton(false);
    }
  };

  const goHome = () => {
    setScoreModal(false);
    navigation.navigate("Home")
  }

  const renderContinueButton = () => {
    if (continueButton) {
      return (
        <TouchableOpacity onPress={() => handleNext()} style={styles.continue_btn_container}>
          <Text style={styles.continue_btn}>
            {currentQuestionIndex == allQuestions.length - 1 ? <Text>END </Text> : <Text>Continue </Text>}
          </Text>
          <Ionicons name="arrow-forward-circle-outline" size={28} style={styles.continue_arrow} />
        </TouchableOpacity>
      )
    }
  }


  const renderOptions = () => {
    return (
      <View>
        {allQuestions[currentQuestionIndex]?.options.map(option => (
          <View style={styles.answer_container}>
            <TouchableOpacity onPress={() => validateAnswer(option)} disabled={isOptionDisabled}>
              <Text style={styles.answer}> {option} </Text>

              {
                option == correctOption ? (
                  <View style={styles.correct_logo}>
                    <AntDesign name="checkcircleo" size={30} color="#70e000" />
                  </View>
                ) : option == currentOptionSelected ? (
                  <View style={styles.wrong_logo}>
                    <Entypo name="circle-with-cross" size={30} color="#d90429" />
                  </View>
                ) : null
              }
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )
  };

  const renderQuestionNumber = () => {
    return (
      <View >
        <Text style={styles.number}>
          {currentQuestionIndex + 1} / {allQuestions.length}
        </Text>
      </View>
    )
  };

  const renderCurrentQuestion = () => {
    return (
      <View>
        <Text style={styles.question}>
          {allQuestions[currentQuestionIndex]?.question}
        </Text>
      </View>
    )
  };

  const renderModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={scoreModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.result_text}>
                {score > (allQuestions.length / 2) ? 'Congratulations' : 'You Loose'}
              </Text>
              <View>
                <Text style={styles.result_score}>
                  {score} / {allQuestions.length}
                </Text>
              </View>
              <TouchableOpacity onPress={() => goHome()}>
                <Text style={styles.result_button}>
                  Go Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.quiz_container}>

        {renderQuestionNumber()}

        {renderCurrentQuestion()}

        {renderOptions()}

        {renderContinueButton()}

        {renderModal()}

      </View>
    </SafeAreaView>

  )
}