import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function EditQuiz({ route, navigation }) {
  const { category, quiz } = route.params;
  const [question, setQuestion] = useState(quiz.question);
  const [options, setOptions] = useState(quiz.options);
  const [correctOption, setCorrectOption] = useState(quiz.correct_option);
  const [level, setLevel] = useState(quiz.level);

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

      alert("Quiz updated successfully!");
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

      alert("Quiz deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.log("Error deleting quiz:", error);
      alert("Error deleting quiz. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
  
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
          style={styles.optionInput}
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
      <TextInput
        style={styles.input}
        value={level}
        onChangeText={setLevel}
        placeholder="Enter level"
      />
  
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateQuiz}>
        <Text style={styles.updateButtonText}>Update Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteQuiz}>
        <Text style={styles.deleteButtonText}>Delete Quiz</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#5E60CE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF5050",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
