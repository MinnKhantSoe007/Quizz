import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc, onSnapshot, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from 'react-native-date-picker';
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
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startTempTime, setStartTempTime] = useState(new Date());
  const [endTempTime, setEndTempTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [options, setOptions] = useState([]);
  const [current, setCurrent] = useState("1");
  const [quizData, setQuizData] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([])

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(doc(firestore, "categories", categoryId), 'quizzes'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuizData(data);
      const uniqueLevels = new Set(data.map(item => item.level));
      const uniqueLevelsArray = Array.from(uniqueLevels);
      setAvailableLevels(uniqueLevelsArray);
      current === "2" ? setLevel(uniqueLevelsArray[0]) : console.log("");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [current]);

  useEffect(() => {
    setOptions([option1, option2, option3, option4].filter(option => option.trim() !== ""));
    setCorrectOption(option1)
  }, [option1, option2, option3, option4]);

  useEffect(() => {
    if (current === "2") {
      const selectedLevelData = quizData.find(item => item.level === level);
      if (selectedLevelData) {
        setDuration(selectedLevelData.duration);
        setStartTime(new Date(selectedLevelData.startTime));
        setEndTime(new Date(selectedLevelData.endTime));
      }
    } else {
      setDuration("");
      setStartTime(null);
      setEndTime(null);
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
    if (current === "1" && quizData.some((quiz) => quiz.level === level)) {
      alert("A level with the same name exists. Please choose the 'Add to existing level' option.");
      return;
    }

    const quizzesCollectionRef = collection(firestore, "categories", categoryId, "quizzes");
    setLoading1(true);

    await addDoc(quizzesCollectionRef, {
      question,
      options: [option1, option2, option3, option4],
      correct_option: correctOption,
      reason: reason,
      level,
      score: parseInt(score),
      duration,
      startTime: startTime ? startTime.toLocaleString() : null,
      endTime: endTime ? endTime.toLocaleString() : null,
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
        setStartTime(null);
        setEndTime(null);
        navigation.goBack();
      })
      .catch((error) => {
        alert("Error creating quiz: " + error.message);
        console.log(error);
      });
  };

  const manageStartTimePicker = () => {
    if (current === "1") {
      setShowStartTimePicker(true);
    }
  }

  const manageEndTimePicker = () => {
    if (current === "1") {
      setShowEndTimePicker(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

      <ScrollView style={styles.inputs} showsVerticalScrollIndicator={false}>

        <DatePicker
          modal
          open={showStartTimePicker}
          date={startTempTime}
          onDateChange={setStartTempTime}
          mode="datetime"
          onCancel={() => setShowStartTimePicker(false)}
          onConfirm={(date) => {
            setStartTime(date);
            setShowStartTimePicker(false);
          }}
        />

        <DatePicker
          modal
          open={showEndTimePicker}
          date={endTempTime}
          onDateChange={setEndTempTime}
          mode="datetime"
          onCancel={() => setShowEndTimePicker(false)}
          onConfirm={(date) => {
            setEndTime(date);
            setShowEndTimePicker(false);
          }}
        />

        <Text style={styles.label}>Question:</Text>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Enter the question"
          multiline={true}
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
          onValueChange={(itemValue) => setCorrectOption(itemValue)}
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
        {current === "2" ? (
          <Picker
            style={styles.input}
            selectedValue={level}
            onValueChange={(itemValue) => setLevel(itemValue)}
          >
            {availableLevels.map((level) => (
              <Picker.Item key={level} label={level} value={level} />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={styles.input}
            value={level}
            onChangeText={setLevel}
            placeholder="Enter Level"
          />
        )}

        <Text style={styles.label}>Duration:</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter Duration"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Start Time:</Text>
        <TouchableRipple onPress={manageStartTimePicker}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              value={startTime ? startTime.toLocaleString() == "Invalid Date" ? '' : startTime.toLocaleString() : ''}
              placeholder="Select Start Time"
            />
          </View>
        </TouchableRipple>

        <Text style={styles.label}>End Time:</Text>
        <TouchableRipple onPress={manageEndTimePicker}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              value={endTime ? endTime.toLocaleString() == "Invalid Date" ? '' : endTime.toLocaleString() : ''}
              placeholder="Select End Time"
            />
          </View>
        </TouchableRipple>

        {loading || loading1 ? <ActivityIndicator animating={true} size="large" color="black" /> :
          <TouchableRipple style={styles.createButton} onPress={handleCreateQuiz}>
            <Text style={styles.createButtonText}>Create Quiz</Text>
          </TouchableRipple>
        }

      </ScrollView>
    </SafeAreaView>
  );
}
