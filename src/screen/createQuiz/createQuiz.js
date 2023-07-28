import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, doc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function CreateQuiz({ route, navigation }) {
  const { categoryId } = route.params;
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateQuiz = async () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;


    if (question.trim() === "" || option1.trim() === "" || option2.trim() === "" || option3.trim() === "" || option4.trim() === "" || correctOption.trim() === "" || level.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }



    const quizzesCollectionRef = collection(firestore, "categories", categoryId, "quizzes");
    setLoading(true);
    await addDoc(quizzesCollectionRef, {
      question,
      options: [option1, option2, option3, option4],
      correct_option: correctOption,
      level,
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
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        alert("Error creating quiz: " + error.message);
        console.log(error);
      });
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
        placeholder="Enter the correct option"
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
        
        {loading && <ActivityIndicator animating={true} size="large" color="black" />}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateQuiz}>
        <Text style={styles.createButtonText}>Create Quiz</Text>
        </TouchableOpacity>
        
        </ScrollView>
    </View>
  );
}
