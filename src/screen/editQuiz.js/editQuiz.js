import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { doc, updateDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native-paper";
import { TouchableRipple } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

export default function EditQuiz({ route, navigation }) {
  const { category, quiz } = route.params;
  const [question, setQuestion] = useState(quiz.question);
  const [options, setOptions] = useState(quiz.options);
  const [correctOption, setCorrectOption] = useState(quiz.correct_option);
  const [reason, setReason] = useState(quiz.reason)
  const [score, setScore] = useState(quiz.score.toString())
  const [level, setLevel] = useState(quiz.level);
  const [duration, setDuration] = useState(quiz.duration);
  const [startTime, setStartTime] = useState(quiz.startTime);
  const [endTime, setEndTime] = useState(quiz.endTime);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [current, setCurrent] = useState("2")
  const [availableLevels, setAvailableLevels] = useState([])
  const [quizData, setQuizData] = useState([])
  const [startTempTime, setStartTempTime] = useState(new Date());
  const [endTempTime, setEndTempTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    return unsubscribe = onSnapshot(collection(doc(firestore, "categories", category.id), 'quizzes')
      , (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizData(data);
        const uniqueLevels = new Set(data.map(item => item.level));
        const uniqueLevelsArray = Array.from(uniqueLevels);
        setAvailableLevels(uniqueLevelsArray)
        // current === "2" ? setLevel(uniqueLevelsArray[0]) : console.log("");
        setLoading(false);
      });

  }, [current]);

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

  const handleOptionChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
    setCorrectOption(updatedOptions[0])
  };

  const handleUpdateQuiz = async () => {

    if (
      question.trim() === "" ||
      options[0].trim() === "" ||
      correctOption.trim() === "" ||
      score.trim() === "" ||
      duration.trim() === "" ||
      level.trim() === ""
    ) {
      setLoading(false)
      alert("Please fill related fields.");
      return;
    }
    if (endTime && startTime && current == "1") {
      if (endTime <= startTime) {
        alert("End time must be greater than start time.");
        return;
      }
    }
    if (current === "1" && quizData.some((quiz) => quiz.level == level)) {
      alert("A level with the same name exists. Please choose the 'Add to existing level' option.");
      return;
    }

    try {
      const quizRef = doc(firestore, "categories", category.id, "quizzes", quiz.id);
      setLoading1(true)
      await updateDoc(quizRef, {
        question: question,
        options: options,
        correct_option: correctOption,
        reason: reason,
        score: parseInt(score),
        duration: duration,
        level: level,
        startTime: startTime.toLocaleString(),
        endTime: endTime.toLocaleString()
      });
      setLoading1(false)
      navigation.goBack();
    } catch (error) {
      setLoading1(false)
      console.log("Error updating quiz:", error);
      alert("Error updating quiz. Please try again.");
    }
  };

  const handleDeleteQuiz = async () => {
    setLoading(true);
    try {
      const quizRef = doc(firestore, "categories", category.id, "quizzes", quiz.id);
      await deleteDoc(quizRef);
      navigation.goBack();
      setLoading(false)
    } catch (error) {
      console.log("Error deleting quiz:", error);
      setLoading(false)
      alert("Error deleting quiz. Please try again.");
    }
  };

  const deleteQuiz = () => {
    setModal(true);
  }

  const renderDeleteModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <Text style={styles.success}>
                Are you sure?
              </Text>

              <Text style={styles.check}>
                This quiz will be permanently deleted.
              </Text>

              <TouchableOpacity onPress={handleDeleteQuiz}>
                <Text style={styles.ok}>
                  Okay
                </Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModal(false)}>
                <Text style={styles.no}>
                  No
                </Text>

              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
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
          placeholder="Enter question"
        />

        <Text style={styles.label}>Options:</Text>
        {options.map((option, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={option}
            onChangeText={(text) => handleOptionChange(index, text)}
            placeholder={`Option ${index + 1}`}
          />
        ))}

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

        {renderDeleteModal()}
        {/* Start Time Picker Modal */}
        {renderModal("start")}

        {/* End Time Picker Modal */}
        {renderModal("end")}

        {
          loading || loading1 ? <ActivityIndicator animating={true} size="large" color="black" /> :
            <View>
              <TouchableRipple style={styles.updateButton} onPress={handleUpdateQuiz}>
                <Text style={styles.updateButtonText}>Update Quiz</Text>
              </TouchableRipple>

              <TouchableRipple style={styles.deleteButton} onPress={deleteQuiz}>
                <Text style={styles.deleteButtonText}>Delete Quiz</Text>
              </TouchableRipple>
            </View>

        }

      </ScrollView>
    </SafeAreaView>
  );
}