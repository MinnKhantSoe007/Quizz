import { SafeAreaView, Text, View, TouchableOpacity, Modal, Image, Dimensions } from "react-native";
import { styles } from "./style";
import { DATA } from '../../data/quizData';
import { useState, useEffect } from "react";
import { ImageResource } from "../../resource/imageResource";
import Carousel from "react-native-snap-carousel";
import { TouchableRipple } from "react-native-paper";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from "expo-av";
import { Music } from "../../resource/music";
import { Entypo } from '@expo/vector-icons';

export default function QuizTest({ navigation }) {

  const allQuestions = DATA;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [continueButton, setContinueButton] = useState(false);
  const [scoreModal, setScoreModal] = useState(false);
  const [backModal, setBackModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(50);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const [soundObject, setSoundObject] = useState(null);
  const carouselRef = useRef(null);

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

  const handleSoundLogoPress = async () => {
    try {
      if (soundObject && isSoundPlaying) {
        await soundObject.pauseAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(Music.music.music);
        setSoundObject(sound);
        await sound.playAsync();
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

  const validateAnswer = (selectedOption) => {
    const correct_option = allQuestions[currentQuestionIndex]['correct_option'];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionDisabled(true);

    if (selectedOption == correct_option) {
      setScore(score + 1);
    }
    setContinueButton(true);
    setRemainingTime(50);
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
            {currentQuestionIndex == allQuestions.length - 1 ? <Text>END </Text> : <Text>CONTINUE</Text>}
          </Text>
        </TouchableOpacity>
      )
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex == allQuestions.length - 1) {
      setScoreModal(true);
      setRemainingTime(50);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionDisabled(false);
      setContinueButton(false);
      carouselRef.current.snapToNext();
      setRemainingTime(50);
    }
  };

  const renderItem = ({ item, index }) => {
    console.log("Item ::", item);
    return (
      <View style={{ height: Dimensions.get('window').height * 0.7, borderRadius: 10, backgroundColor: '#fff' }}>
        <View style={{ minHeight: 100 }}>
          <Text style={styles.number}>
            {item.question}
          </Text>
        </View>

        <View>
          {item.options.map((item, index) => (
            <TouchableRipple onPress={() => validateAnswer(item)} key={index} borderless={true} disabled={isOptionDisabled} style={{ margin: 15, borderRadius: 10 }}>
              <View style={item == correctOption ? styles.correct_answer_container : correctOption !== currentOptionSelected && item == currentOptionSelected ? styles.wrong_answer_container : styles.answer_container}>
                <Text style={styles.answer}>{index + 1}. {item}</Text>
              </View>
            </TouchableRipple>
          ))}
        </View>

        {renderContinueButton()}

      </View>
    )
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

              {score > (allQuestions.length / 2) ?
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

                <Text style={styles.scoreText(score > (allQuestions.length / 2))}>
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
            {[...Array(allQuestions.length ?? 0)].map((_, i) => {
              return (
                <View key={i} style={styles.indicatorStyle(i == activeIndex)}>
                  <Text style={styles.indicatorText(i == activeIndex)}>{i + 1}</Text>
                </View>
              )
            })}
          </View>

          <View>
            <Carousel
              ref={carouselRef}
              layout={"default"}
              data={allQuestions}
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