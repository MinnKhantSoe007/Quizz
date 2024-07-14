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
  const { timeLimit, category, difficultyLevel } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState({});
  const [correctOption, setCorrectOption] = useState({});
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreModal, setScoreModal] = useState(false);
  const [backModal, setBackModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reRenderOccur, forceRenderTimer] = useState({});
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const [soundObject, setSoundObject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const carouselRef = useRef(null);
  const currentQuestion = questions[activeIndex];
  const [timeOver, setTimeOver] = useState(false)

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

  // useEffect(() => {
  //   Audio.setAudioModeAsync({
  //     shouldDuckAndroid: true,
  //     playThroughEarpieceAndroid: false,
  //   });
  // }, []);

  // useEffect(() => {
  //   const loadInitialMusic = async () => {
  //     const { sound } = await Audio.Sound.createAsync(Music.music.music, {
  //       shouldPlay: false, // Initially load but do not play
  //       isLooping: true
  //     });
  //     setSoundObject(sound);
  //     console.log('Initial music sound loaded.');
  //   };

  //   loadInitialMusic();

  //   return () => {
  //     if (soundObject) {
  //       soundObject.unloadAsync();
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const loadSounds = async () => {
  //     const correctSound = new Audio.Sound();
  //     const wrongSound = new Audio.Sound();

  //     try {
  //       await correctSound.loadAsync(Music.music.correct);
  //       await wrongSound.loadAsync(Music.music.wrong);
  //       correctSoundRef.current = correctSound;
  //       wrongSoundRef.current = wrongSound;
  //       console.log('Correct and wrong sounds loaded.');
  //     } catch (error) {
  //       console.error('Error loading sounds:', error);
  //     }
  //   };

  //   loadSounds();

  //   return () => {
  //     if (correctSoundRef.current) {
  //       correctSoundRef.current.unloadAsync();
  //     }
  //     if (wrongSoundRef.current) {
  //       wrongSoundRef.current.unloadAsync();
  //     }
  //   };
  // }, []);

  // const handleSoundLogoPress = async () => {
  //   try {
  //     if (soundObject && isSoundPlaying) {
  //       console.log('Pausing sound...');
  //       await soundObject.pauseAsync();
  //       setIsSoundPlaying(false);
  //       console.log('Sound paused.');
  //     } else {
  //       if (soundObject) {
  //         console.log('Resuming sound...');
  //         await soundObject.playAsync();
  //         setIsSoundPlaying(true);
  //         console.log('Sound resumed.');
  //       } else {
  //         console.log('Creating and playing new sound...');
  //         const { sound } = await Audio.Sound.createAsync(Music.music.music, {
  //           shouldPlay: true,
  //           isLooping: true
  //         });
  //         await sound.setVolumeAsync(1.0); // Set volume to 100%
  //         setSoundObject(sound);
  //         setIsSoundPlaying(true);
  //         console.log('Sound created and playing.');
  //       }
  //     }
  //     setIsLogoChanged(!isLogoChanged);
  //   } catch (error) {
  //     console.error('Error while playing sound:', error);
  //   }
  // };

  // const renderSoundLogo = () => {
  //   return (
  //     <TouchableOpacity onPress={handleSoundLogoPress} style={styles.sound_logo}>
  //       <Text>
  //         {isLogoChanged ? <Entypo name="sound" size={24} color="black" /> : <Entypo name="sound-mute" size={24} color="black" />}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };



  const AnswerOption = React.memo(
    ({ option, index, questionId, selectedOption, correctOption, isOptionDisabled, onPress }) => {
      const isSelected = selectedOption[questionId] === option;
      const isCorrect = correctOption === option;
      return (
        <TouchableRipple
          onPress={() => onPress(option, questionId)}
          key={index}
          borderless={true}
          disabled={isOptionDisabled}
          style={{ margin: 15, borderRadius: 10 }}
        >
          <View
            style={
              isSelected && !quizEnded // Highlight selected option in blue if quiz is not ended
                ? styles.selected_option_container
                : isCorrect && quizEnded // Highlight correct option after quiz ends
                  ? styles.correct_answer_container
                  : isSelected && !isCorrect && quizEnded // Highlight wrong option after quiz ends
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

  const validateAnswer = useCallback((selectedOption, questionId) => {
    if (quizEnded) return; // Do not allow changes after the quiz ends
    setCurrentOptionSelected((prevSelected) => ({ ...prevSelected, [questionId]: selectedOption }));
  });

  useEffect(() => {
    const checkEndTime = () => {
      const endTime = questions.length > 0 ? questions[0].endTime : null; // Assuming endTime is the same for all questions

      if (endTime && new Date().toLocaleString() >= endTime) {
        setTimeOver(true);
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


  const endQuiz = useCallback(() => {
    if (quizEnded) return; // Ensure endQuiz is only called once

    setIsOptionDisabled(true);
    setQuizEnded(true);
    setScoreModal(true);

    // Calculate the score
    let totalScore = 0;
    questions.forEach((question) => {
      if (question.correct_option == currentOptionSelected[question.id]) {
        totalScore += question.score;
        console.log("UserTotalScore::", totalScore);
      }
    });
    setScore(totalScore);
  }, [questions, currentOptionSelected, quizEnded]);



  const goHome = () => {
    setScoreModal(false);
  };

  const renderModal = () => {
    // Calculate the total score
    const totalScore = questions.reduce((total, question) => total + question.score, 0);
    console.log("TotalScore::", totalScore);
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

  const renderIndicators = () => {
    const numQuestions = questions.length;

    return Array.from({ length: numQuestions }, (_, i) => (
      <View key={i} style={styles.indicatorStyle(i === activeIndex)}>
        <Text style={styles.indicatorText(i === activeIndex)}>{i + 1}</Text>
      </View>
    ));
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
                questionId={item.id}
                selectedOption={currentOptionSelected}
                correctOption={item.correct_option}
                isOptionDisabled={isOptionDisabled}
                onPress={validateAnswer}
              />
            ))}
          </View>

          {quizEnded && (
            <View>
              <Text style={styles.continue_btn}>{item.reason}</Text>
            </View>
          )}

          {activeIndex === questions.length - 1 && !quizEnded && (
            <TouchableOpacity style={styles.next_button} onPress={endQuiz}>
              <Text style={styles.continue_btn}>End Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [currentQuestion, currentOptionSelected, correctOption, isOptionDisabled, quizEnded]
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
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#E8EEFE", "#B5D5FD", "#85B8FB", "#6F97F3"]} style={{ flex: 1 }}>
        <View style={styles.quiz_container}>
          <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => setBackModal(true)} />
          <View style={styles.timerContainer}>
            <TimerComponent reRenderOccur={reRenderOccur} initialTime={timeLimit * 60} isOptionDisabled={isOptionDisabled} handleNext={endQuiz} />
          </View>
          {/* {renderSoundLogo()} */}
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
              onSnapToItem={(idx) => setActiveIndex(idx)}
              scrollEnabled={true}
            />
          </View>
        </View>
      </LinearGradient>
      {renderModal()}
      {renderBackModal()}
    </SafeAreaView>
  );
}

const TimerComponent = ({ initialTime, isOptionDisabled, handleNext, reRenderOccur }) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    setRemainingTime(initialTime);
  }, [reRenderOccur]);

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
