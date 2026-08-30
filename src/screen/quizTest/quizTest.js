import { Text, View, TouchableOpacity, Modal, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";
import { Colors } from "../../theme/theme";
import Loader from "../../components/Loader";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ImageResource } from "../../resource/imageResource";
import { TouchableRipple } from "react-native-paper";
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import { Music } from "../../resource/music";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, addDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function QuizTest({ navigation, route }) {
  const { timeLimit, category, difficultyLevel } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState({});
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreModal, setScoreModal] = useState(false);
  const [backModal, setBackModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const directionRef = useRef(1); // 1 = advancing, -1 = going back
  const cardAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex, cardAnim]);

  const cardTranslateX = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [directionRef.current * 24, 0],
  });

  useEffect(() => {
    const fetchData = async () => {
      const quizzesRef = collection(doc(firestore, "categories", category.id), 'quizzes');
      const quizzesQuery = query(quizzesRef, where("level", "==", difficultyLevel));

      try {
        return onSnapshot(quizzesQuery, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedQuestions = data.sort(() => 0.5 - Math.random());
          setQuestions(selectedQuestions);
        });
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category, difficultyLevel]);

  const musicPlayer = useAudioPlayer(Music.music.music);
  const musicStatus = useAudioPlayerStatus(musicPlayer);

  useEffect(() => {
    setAudioModeAsync({
      interruptionMode: 'duckOthers',
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  useEffect(() => {
    musicPlayer.loop = true;
  }, [musicPlayer]);

  useEffect(() => {
    if (quizEnded) {
      musicPlayer.pause();
    }
  }, [quizEnded, musicPlayer]);

  const handleSoundLogoPress = () => {
    if (musicStatus.playing) {
      musicPlayer.pause();
    } else {
      musicPlayer.play();
    }
  };

  const AnswerOption = React.memo(
    ({ option, index, questionId, selectedOption, correctOption, isOptionDisabled, onPress }) => {
      const isSelected = selectedOption[questionId] === option;
      const isCorrect = correctOption === option;

      if (!option) {
        return null; // Do not render the option if it is empty
      }

      let containerStyle = styles.answer_container;
      let showSelectedText = false;

      if (isSelected && !quizEnded) {
        containerStyle = styles.selected_option_container; // Highlight selected option while quiz is in progress
        showSelectedText = true;
      } else if (quizEnded && isCorrect) {
        containerStyle = styles.correct_answer_container; // Reveal the correct option once the quiz ends
        showSelectedText = true;
      } else if (quizEnded && isSelected && !isCorrect) {
        containerStyle = styles.wrong_answer_container; // Highlight the wrong pick once the quiz ends
        showSelectedText = true;
      }

      return (
        <TouchableRipple
          onPress={() => onPress(option, questionId)}
          borderless
          disabled={isOptionDisabled}
          style={styles.rippleWrapper}
        >
          <View style={containerStyle}>
            <Text style={[styles.answer, showSelectedText && styles.answerSelected]}>
              {index + 1}. {option}
            </Text>
          </View>
        </TouchableRipple>
      );
    }
  );

  const validateAnswer = useCallback((selectedOption, questionId) => {
    if (quizEnded) return; // Do not allow changes after the quiz ends
    setCurrentOptionSelected((prevSelected) => ({ ...prevSelected, [questionId]: selectedOption }));
  });

  useEffect(() => {
    const checkEndTime = () => {
      const endTime = questions.length > 0 ? questions[0].endTime : null; // Assuming endTime is the same for all questions

      if (endTime && new Date().toLocaleString() >= endTime) {
        if (!quizEnded) {
          endQuiz();
        }
      }
    };

    const timer = setInterval(() => {
      if (!quizEnded) {
        checkEndTime();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, quizEnded]);


  const endQuiz = useCallback(async () => {
    if (quizEnded) return; // Ensure endQuiz is only called once

    setIsOptionDisabled(true);
    setQuizEnded(true);
    setScoreModal(true);

    // Calculate the score
    let totalScore = 0;
    questions.forEach((question) => {
      if (question.correct_option == currentOptionSelected[question.id]) {
        totalScore += question.score;
      }
    });
    setScore(totalScore);

    // Retrieve user information from AsyncStorage
    const studentYear = await AsyncStorage.getItem('studentYear');
    const studentName = await AsyncStorage.getItem('studentName');

    // Calculate percent score
    const totalPossibleScore = questions.reduce((total, question) => total + question.score, 0);
    const percentScore = Math.round((totalScore / totalPossibleScore) * 100);

    // Get current date
    const currentDate = new Date().toLocaleString();

    // Prepare the history data
    const historyData = {
      studentName,
      studentYear,
      date: currentDate,
      categoryName: category?.title,
      categoryId: category?.id, // Assuming category has a name property
      difficultyLevel,
      percent: percentScore,
    };

    try {
      // Add the history data to Firestore
      const historyRef = collection(firestore, 'history');
      await addDoc(historyRef, historyData);
      console.log('History data added:', historyData);
    } catch (error) {
      console.error('Error adding history data:', error);
    }
  }, [questions, currentOptionSelected, quizEnded, category.name, difficultyLevel]);

  const goHome = () => {
    setScoreModal(false);
  };

  const goToPrevious = () => {
    directionRef.current = -1;
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  };

  const goToNext = () => {
    if (!quizEnded && isLastQuestion) {
      endQuiz();
      return;
    }
    directionRef.current = 1;
    setCurrentQuestionIndex((index) => Math.min(questions.length - 1, index + 1));
  };

  const renderModal = () => {
    // Calculate the total score
    const totalScore = questions.reduce((total, question) => total + question.score, 0);
    return (
      <View>
        <Modal animationType="slide" transparent={true} visible={scoreModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {score > totalScore / 2 ? (
                <View style={styles.img_container}>
                  <Image source={ImageResource.logo.congraz_logo} style={styles.img_congraz} resizeMode="contain" />
                  <Text style={styles.result_text}>Congratulations</Text>
                </View>
              ) : (
                <View style={styles.img_container}>
                  <Image source={ImageResource.logo.loose_logo} style={styles.img_congraz} resizeMode="contain" />
                  <Text style={styles.result_text}>You Lose</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.scoreText(score > totalScore / 2)}>
                  {score} / {totalScore}
                </Text>
              </View>
              <TouchableOpacity onPress={goHome}>
                <Text style={styles.result_button}>See Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderBackModal = () => {

    return (

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={backModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <Text style={styles.sure_text}>
                Are You Sure ?
              </Text>

              {quizEnded ?
                <Text style={styles.loose_text}>
                  You can't see the correct answer and reasons again.
                </Text> :
                <Text style={styles.loose_text}>
                  You will loose all your progress.
                </Text>
              }

              <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => navigation.navigate("Category")}>
                  <Text style={styles.yes}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setBackModal(false)}>
                  <Text style={styles.no}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSoundLogoPress} disabled={quizEnded} activeOpacity={0.75}>
          <Entypo
            name={musicStatus.playing ? 'sound' : 'sound-mute'}
            size={22}
            color={quizEnded ? Colors.textPlaceholder : Colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {category?.title}
        </Text>

        <TouchableOpacity onPress={() => setBackModal(true)} activeOpacity={0.75}>
          <Ionicons name="close" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {!currentQuestion ? (
        <Loader />
      ) : (
        <>
          <Animated.View
            style={[styles.card, { opacity: cardAnim, transform: [{ translateX: cardTranslateX }] }]}
          >
            <TimerComponent initialTime={timeLimit * 60} isOptionDisabled={isOptionDisabled} handleNext={endQuiz} />

            <View style={styles.metaRow}>
              <Text style={styles.questionCount}>
                Question: {currentQuestionIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.levelText}>Level : {difficultyLevel}</Text>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View>
              {currentQuestion.options.filter(Boolean).map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  questionId={currentQuestion.id}
                  selectedOption={currentOptionSelected}
                  correctOption={currentQuestion.correct_option}
                  isOptionDisabled={isOptionDisabled}
                  onPress={validateAnswer}
                />
              ))}
            </View>

            {quizEnded && currentQuestion.reason ? (
              <Text style={styles.reasonText}>{currentQuestion.reason}</Text>
            ) : null}
          </Animated.View>

          <View style={styles.navRow}>
            {currentQuestionIndex > 0 ? (
              <TouchableOpacity onPress={goToPrevious} style={styles.navButton} activeOpacity={0.75}>
                <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            {(!quizEnded || !isLastQuestion) && (
              <TouchableOpacity onPress={goToNext} style={styles.navButton} activeOpacity={0.75}>
                <Text
                  style={[
                    styles.navButtonText,
                    !quizEnded && isLastQuestion && styles.navButtonTextPrimary,
                  ]}
                >
                  {!quizEnded && isLastQuestion ? 'Submit' : 'Next'}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={!quizEnded && isLastQuestion ? Colors.primary : Colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {renderModal()}
      {renderBackModal()}
    </SafeAreaView>
  );
}

const TimerComponent = ({ initialTime, isOptionDisabled, handleNext }) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && !isOptionDisabled) {
      timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleNext();
    }
    return () => clearTimeout(timer);
  }, [remainingTime, isOptionDisabled]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Text style={styles.timerText}>
      {minutes}m {seconds}s remaining
    </Text>
  );
}
