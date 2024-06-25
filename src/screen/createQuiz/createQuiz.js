import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Modal } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc, onSnapshot, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

export default function CreateQuiz({ route, navigation }) {
  const { categoryId } = route.params;
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [level, setLevel] = useState("");
  const [reason, setReason] = useState("");
  const [score, setScore] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startTempTime, setStartTempTime] = useState(new Date());
  const [endTime, setEndTime] = useState("");
  const [endTempTime, setEndTempTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [options, setOptions] = useState([]);
  const [current, setCurrent] = useState("1");
  const [quizData, setQuizData] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([])

  useEffect(() => {
    setLoading(true);
    return unsubscribe = onSnapshot(collection(doc(firestore, "categories", categoryId), 'quizzes')
      , (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizData(data);
        const uniqueLevels = new Set(data.map(item => item.level));
        const uniqueLevelsArray = Array.from(uniqueLevels);
        setAvailableLevels(uniqueLevelsArray)
        current === "2" ? setLevel(uniqueLevelsArray[0]) : console.log("");
        setLoading(false);
      });

  }, [current]);

  useEffect(() => {
    setOptions([option1, option2, option3, option4].filter(option => option.trim() !== ""));
    setCorrectOption(option1)
  }, [option1, option2, option3, option4]);

  useEffect(() => {
    if (current === "2") {
      // setLoading(true)

      const selectedLevelData = quizData.find(item => item.level === level);
      if (selectedLevelData) {
        setDuration(selectedLevelData.duration);
        setStartTime(selectedLevelData.startTime);
        setEndTime(selectedLevelData.endTime);
      }
      // setLoading(false)
    } else {
      setDuration("");
      setStartTime("");
      setEndTime("");
    }
  }, [current, level, quizData]);

  const handleCreateQuiz = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (question.trim() === "" || option1.trim() === "" || correctOption.trim() === "" || level.trim() === "" || score.trim() === "" || duration.trim() === "") {
      alert("Please fill in related fields.");
      return;
    }
    if (endTime && startTime) {
      if (endTime <= startTime) {
        alert("End time must be greater than start time.");
        return;
      }
    }
    if (current === "1" && quizData.some((quiz) => quiz.level == level)) {
      alert("A level with the same name exists. Please choose the 'Add to existing level' option.");
      return;
    }

    const quizzesCollectionRef = collection(firestore, "categories", categoryId, "quizzes");
    setLoading(true);

    await addDoc(quizzesCollectionRef, {
      question,
      options: [option1, option2, option3, option4],
      correct_option: correctOption,
      reason: reason,
      level,
      score: parseInt(score),
      duration,
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      creatorUid: userId,
    })
      .then(() => {
        setQuestion("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectOption("");
        setLevel("");
        setScore("");
        setDuration("");
        setStartTime("");
        setEndTime("");
        // setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        alert("Error creating quiz: " + error.message);
        console.log(error);
      });
  };

  const handleConfirmDate = (type) => {
    if (type === "start") {
      setStartTime(startTempTime);
    } else {
      setEndTime(endTempTime);
    }
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  const manageStartTimePicker = () => {
    if (current === "1") {
      setShowStartTimePicker(true);
    } else {
      // do nothing
    }
  }

  const manageEndTimePicker = () => {
    if (current === "1") {
      setShowEndTimePicker(true);
    } else {
      // do nothing
    }
  }

  const renderModal = (type) => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={type === "start" ? showStartTimePicker : showEndTimePicker}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DateTimePicker
                value={type === "start" ? startTempTime : endTempTime}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    type === "start" ? setStartTempTime(selectedDate) : setEndTempTime(selectedDate);
                  }
                }}
              />
              <TouchableRipple onPress={() => handleConfirmDate(type)}>
                <Text style={styles.ok}>
                  Okay
                </Text>
              </TouchableRipple>
              <TouchableRipple onPress={() => type === "start" ? setShowStartTimePicker(false) : setShowEndTimePicker(false)}>
                <Text style={styles.no}>
                  No
                </Text>
              </TouchableRipple>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

      <ScrollView style={styles.inputs} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Question:</Text>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Enter the question"
        />

        <Text style={styles.label}>Options:</Text>
        <TextInput
          style={styles.input}
          value={option1}
          onChangeText={setOption1}
          placeholder="Enter option 1"
        />
        <TextInput
          style={styles.input}
          value={option2}
          onChangeText={setOption2}
          placeholder="Enter option 2"
        />
        <TextInput
          style={styles.input}
          value={option3}
          onChangeText={setOption3}
          placeholder="Enter option 3"
        />
        <TextInput
          style={styles.input}
          value={option4}
          onChangeText={setOption4}
          placeholder="Enter option 4"
        />

        <Text style={styles.label}>Correct Option:</Text>
        <Picker
          style={styles.input}
          selectedValue={correctOption}
          onValueChange={(itemValue, itemIndex) => setCorrectOption(itemValue)}
        >
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <Text style={styles.label}>Reason:</Text>
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter Reason"
          multiline={true}
        />

        <Text style={styles.label}>Score:</Text>
        <TextInput
          style={styles.input}
          value={score}
          onChangeText={setScore}
          placeholder="Enter Score"
          keyboardType="numeric"
        />

        <View style={{ marginBottom: 20 }}>
          <RadioButtonGroup
            containerStyle={{ marginBottom: 10 }}
            selected={current}
            onSelected={(value) => setCurrent(value)}
            radioBackground="#5E60CE"
            size={25}
          >
            <RadioButtonItem
              value="1"
              label={
                <Text style={styles.label}>Create New Level</Text>
              }
              style={{ marginBottom: 10 }}
            />

            <RadioButtonItem
              value="2"
              label={
                <Text style={styles.Radiolabel}>Add to existing level</Text>
              }
            />
          </RadioButtonGroup>
        </View>

        <Text style={styles.label}>Level:</Text>
        {current === "1" ? (
          <TextInput
            style={styles.input}
            value={level}
            onChangeText={setLevel}
            placeholder="Enter the level"
          />
        ) : (
          <Picker
            style={styles.input}
            selectedValue={level}
            onValueChange={(itemValue, itemIndex) => setLevel(itemValue)}
          >
            {availableLevels.map((level) => (
              <Picker.Item key={level} label={level} value={level} />
            ))}
          </Picker>
        )}

        <Text style={styles.label}>Duration (in minutes):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          placeholder="Enter Duration in minutes"
          onChangeText={setDuration}
          keyboardType="numeric"
          editable={current === "1"}
        />

        <Text style={styles.label}>Start Time:</Text>
        <TextInput
          style={styles.input}
          value={startTime ? startTime.toLocaleString() : ""}
          editable={false}
          placeholder="Select Start Time"
          onPress={() => manageStartTimePicker()}
        />

        <Text style={styles.label}>End Time:</Text>
        <TextInput
          style={styles.input}
          value={endTime ? endTime.toLocaleString() : ""}
          editable={false}
          placeholder="Select End Time"
          onPress={() => manageEndTimePicker()}
        />

        {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
          <TouchableRipple style={styles.createButton} onPress={handleCreateQuiz}>
            <Text style={styles.createButtonText}>Create Quiz</Text>
          </TouchableRipple>
        }
      </ScrollView>

      {/* Start Time Picker Modal */}
      {renderModal("start")}

      {/* End Time Picker Modal */}
      {renderModal("end")}
    </SafeAreaView>
  );
}
