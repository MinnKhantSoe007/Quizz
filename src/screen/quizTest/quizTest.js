import { SafeAreaView, Text, View, TouchableOpacity, Modal, Image, Dimensions } from "react-native";
import { styles } from "./style";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ImageResource } from "../../resource/imageResource";
import Carousel from "react-native-snap-carousel";
import { TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from "expo-av";
import { Music } from "../../resource/music";
import { Entypo } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";

export default function QuizTest({ navigation, route }) {

  const { questionCount, timeLimit, category, difficultyLevel } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [continueButton, setContinueButton] = useState(false);
  const [scoreModal, setScoreModal] = useState(false);
  const [backModal, setBackModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const [soundObject, setSoundObject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const carouselRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  const currentQuestion = questions[activeIndex];

  useEffect(() => {

    let timer;
    if (remainingTime > 0 && !isOptionDisabled) {
      timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && !isOptionDisabled) {
      handleNext();
    }
    return () => clearTimeout(timer);

  }, [remainingTime, isOptionDisabled]);

  useEffect(() => {

    Audio.setAudioModeAsync({
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);

  useEffect(() => {
    const fetchData = async () => {
      const quizzesRef = collection(doc(firestore, "categories", category.id), 'quizzes');
      const quizzesQuery = query(quizzesRef, where("level", "==", difficultyLevel));

      try {
        return onSnapshot(quizzesQuery, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const selectedQuestions = data.sort(() => 0.5 - Math.random()).slice(0, questionCount);
          setQuestions(selectedQuestions);
        });
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category, difficultyLevel, questionCount]);

  useEffect(() => {
    const loadSounds = async () => {
      const correctSound = new Audio.Sound();
      const wrongSound = new Audio.Sound();

      try {
        await correctSound.loadAsync(Music.music.correct);
        await wrongSound.loadAsync(Music.music.wrong);
        correctSoundRef.current = correctSound;
        wrongSoundRef.current = wrongSound;
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();

    return () => {
      if (correctSoundRef.current) {
        correctSoundRef.current.unloadAsync();
      }
      if (wrongSoundRef.current) {
        wrongSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleSoundLogoPress = async () => {
    try {
      if (soundObject && isSoundPlaying) {
        await soundObject.pauseAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(Music.music.music, {
          shouldPlay: true,
          isLooping: true
        });
        setSoundObject(sound);
      }
      setIsSoundPlaying(!isSoundPlaying);
      setIsLogoChanged(!isLogoChanged);
    } catch (error) {
      console.error('Error while playing sound:', error);
    }
  };

  const renderSoundLogo = () => {
    return (
      <TouchableOpacity onPress={handleSoundLogoPress} style={styles.sound_logo}>
        <Text>
          {isLogoChanged ? <Entypo name="sound" size={24} color="black" /> : <Entypo name="sound-mute" size={24} color="black" />}
        </Text>
      </TouchableOpacity>
    );
  };

  const AnswerOption = React.memo(
    ({ option, index, selectedOption, correctOption, isOptionDisabled, onPress }) => {
      return (
        <TouchableRipple
          onPress={() => onPress(option)}
          key={index}
          borderless={true}
          disabled={isOptionDisabled}
          style={{ margin: 15, borderRadius: 10 }}
        >
          <View
            style={
              option === correctOption
                ? styles.correct_answer_container
                : correctOption !== selectedOption && option === selectedOption
                  ? styles.wrong_answer_container
                  : styles.answer_container
            }
          >
            <Text style={styles.answer}>
              {index + 1}. {option}
            </Text>
          </View>
        </TouchableRipple>
      );
    }
  );

  const validateAnswer = async (selectedOption) => {
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(currentQuestion.correct_option);
    setIsOptionDisabled(true);

    if (selectedOption === currentQuestion.correct_option) {
      setScore((prevScore) => prevScore + 1);
      correctSoundRef.current.replayAsync();
    } else {
      wrongSoundRef.current.replayAsync();
    }

    setContinueButton(true);
    setRemainingTime(timeLimit);
  };

  const goHome = () => {
    setScoreModal(false);
    navigation.navigate("Home")
  };

  const renderContinueButton = () => {
    if (continueButton) {
      return (
        <TouchableOpacity onPress={() => handleNext()}>
          <Text style={styles.continue_btn}>
            {currentQuestionIndex == questions.length - 1 ? <Text>END </Text> : <Text>CONTINUE</Text>}
          </Text>
        </TouchableOpacity>
      )
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex == questions.length - 1) {
      setScoreModal(true);
      setRemainingTime(timeLimit);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionDisabled(false);
      setContinueButton(false);
      carouselRef.current.snapToNext();
      setRemainingTime(timeLimit);
    }
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      if (!currentQuestion) {
        return null;
      }

      return (
        <View style={{ height: Dimensions.get("window").height * 0.7, borderRadius: 10, backgroundColor: "#fff" }}>
          <View style={{ minHeight: 100 }}>
            <Text style={styles.number}>{item.question}</Text>
          </View>

          <View>
            {item.options.map((option, index) => (
              <AnswerOption
                key={index}
                option={option}
                index={index}
                selectedOption={currentOptionSelected}
                correctOption={correctOption}
                isOptionDisabled={isOptionDisabled}
                onPress={validateAnswer}
              />
            ))}
          </View>

          {renderContinueButton()}
        </View>
      );
    },
    [currentQuestion, currentOptionSelected, correctOption, isOptionDisabled, validateAnswer]
  );

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

              <Text style={styles.loose_text}>
                You will loose all your progress.
              </Text>

              <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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

              {score > (questions.length / 2) ?
                <View style={styles.img_container}>
                  <Image source={ImageResource.logo.congraz_logo} style={styles.img_congraz} resizeMode="contain" />
                  <Text style={styles.result_text}>
                    Congratulations
                  </Text>
                </View> :
                <View style={styles.img_container}>
                  <Image source={ImageResource.logo.loose_logo} style={styles.img_congraz} resizeMode="contain" />
                  <Text style={styles.result_text}>
                    You Loose
                  </Text>
                </View>
              }

              <View style={{ flexDirection: 'row' }}>

                <Text style={styles.scoreText(score > (questions.length / 2))}>
                  {score} / {questions.length}
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
  };

  const renderIndicators = () => {
    const maxIndicators = 5;
    const numQuestions = questions.length;
    const numIndicators = Math.min(maxIndicators, numQuestions);

    let startIndex = activeIndex;
    if (numQuestions - activeIndex < numIndicators) {
      startIndex = numQuestions - numIndicators;
    }

    const indicators = [];

    for (let i = 0; i < numIndicators; i++) {
      const questionIndex = startIndex + i;
      indicators.push(
        <View key={i} style={styles.indicatorStyle(questionIndex === activeIndex)}>
          <Text style={styles.indicatorText(questionIndex === activeIndex)}>{questionIndex + 1}</Text>
        </View>
      );
    }

    if (numQuestions > maxIndicators && numQuestions - activeIndex > numIndicators) {
      indicators.push(
        <View key={numIndicators} style={styles.indicatorStyle(false)}>
          <Text style={styles.indicatorText(false)}>...</Text>
        </View>
      );
    }

    return indicators;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#fff", "#5E60CE"]} style={{ flex: 1 }}>
        <View style={styles.quiz_container}>


          <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => setBackModal(true)} />

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{remainingTime}s remaining</Text>
          </View>

          {renderSoundLogo()}

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            {renderIndicators()}
          </View>

          <View>
            <Carousel
              ref={carouselRef}
              layout={"default"}
              data={questions}
              renderItem={renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Math.round(Dimensions.get('window').width * 0.8)}
              containerCustomStyle={{ borderRadius: 10 }}
              onSnapToItem={(idx) => {
                setActiveIndex(idx)
              }}
              scrollEnabled={false}
            />
          </View>

        </View>
      </LinearGradient>

      {renderModal()}

      {renderBackModal()}

    </SafeAreaView>

  );
}