import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function CreateCategory({ navigation }) {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const handleCreateCategory = async () => {
    setLoading(true);
    if (categoryTitle.trim() === '') {
      alert("Please enter a category title.");
      return;
    }

    const titlesCollection = collection(firestore, "categories");
    await addDoc(titlesCollection, {
      title: categoryTitle,
      creatorUid: userId,
    })
      .then(() => {
        setCategoryTitle('');
        navigation.goBack();
      })
      .catch((error) => {
        alert("Error creating category::", error.message);
      });
    setLoading(false);
  };

  return (
    <View style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Question")} />

      <Text style={styles.label}>Category Title:</Text>
      <TextInput
        style={styles.input}
        value={categoryTitle}
        onChangeText={setCategoryTitle}
        placeholder="Enter category title"
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>Create Category</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator animating={true} size="large" color="black" />}

    </View>
  );
}
