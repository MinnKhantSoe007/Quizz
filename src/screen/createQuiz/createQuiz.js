import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, doc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function CreateQuiz({ route, navigation }) {
  const { categoryId } = route.params;
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [level, setLevel] = useState("");

  const handleCreateQuiz = async () => {

    const auth = getAuth(); // Get the current user from Firebase Authentication
    const user = auth.currentUser;
    const userId = user ? user.uid : null;


    if (question.trim() === "" || option1.trim() === "" || option2.trim() === "" || option3.trim() === "" || option4.trim() === "" || correctOption.trim() === "" || level.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    // Add the new quiz to the "quizzes" subcollection in Firestore
    const quizzesCollectionRef = collection(firestore, "categories", categoryId, "quizzes");
    await addDoc(quizzesCollectionRef, {
      question,
      options: [option1, option2, option3, option4],
      correct_option: correctOption,
      level,
      creatorUid: userId, // Replace "USER_ID" with the actual UID of the user creating the quiz
    })
      .then(() => {
        setQuestion("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectOption("");
        setLevel("");
        navigation.goBack();
      })
      .catch((error) => {
        alert("Error creating quiz: " + error.message);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
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
      <TextInput
        style={styles.input}
        value={correctOption}
        onChangeText={setCorrectOption}
        placeholder="Enter the correct option (e.g., 'option1')"
      />

      <Text style={styles.label}>Level:</Text>
      <TextInput
        style={styles.input}
        value={level}
        onChangeText={setLevel}
        placeholder="Enter the level (e.g., 'easy', 'medium', 'hard')"
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateQuiz}>
        <Text style={styles.createButtonText}>Create Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#5E60CE",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
