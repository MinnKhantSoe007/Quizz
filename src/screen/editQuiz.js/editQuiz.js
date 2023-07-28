import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

export default function EditQuiz({ route, navigation }) {
  const { category, quiz } = route.params;
  const [question, setQuestion] = useState(quiz.question);
  const [options, setOptions] = useState(quiz.options);
  const [correctOption, setCorrectOption] = useState(quiz.correct_option);
  const [level, setLevel] = useState(quiz.level);
  const [modal, setModal] = useState(false);

  const handleOptionChange = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text;
    setOptions(updatedOptions);
  };

  const handleUpdateQuiz = async () => {
    if (
      question.trim() === "" ||
      options.some((option) => option.trim() === "") ||
      correctOption.trim() === "" ||
      level.trim() === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const quizRef = doc(firestore, "categories", category.id, "quizzes", quiz.id);
      await updateDoc(quizRef, {
        question: question,
        options: options,
        correct_option: correctOption,
        level: level,
      });
      navigation.goBack();
    } catch (error) {
      console.log("Error updating quiz:", error);
      alert("Error updating quiz. Please try again.");
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const quizRef = doc(firestore, "categories", category.id, "quizzes", quiz.id);
      await deleteDoc(quizRef);
      navigation.goBack();
    } catch (error) {
      console.log("Error deleting quiz:", error);
      alert("Error deleting quiz. Please try again.");
    }
  };

  const deleteQuiz = () => {
    setModal(true);
  }

  const renderModal = () => {
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


  return (
    <View style={styles.container}>

<Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

      <ScrollView style={styles.inputs}>

     
  
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
      <TextInput
        style={styles.input}
        value={correctOption}
        onChangeText={setCorrectOption}
        placeholder="Enter correct option"
      />
  
  <Text style={styles.label}>Level:</Text>
      <Picker
        selectedValue={level}
        onValueChange={(itemValue, itemIndex) =>
          setLevel(itemValue)
        }>
        <Picker.Item label="Easy" value="Easy" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Hard" value="Hard" />
        </Picker>

        {renderModal()}
  
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateQuiz}>
        <Text style={styles.updateButtonText}>Update Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteQuiz}>
        <Text style={styles.deleteButtonText}>Delete Quiz</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}