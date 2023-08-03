import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper"

export default function CreateCategory({ navigation }) {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const handleCreateCategory = async () => {

    if (categoryTitle.trim() === '') {
      alert("Please enter a category title.");
      return;
    }

    setLoading(true);
    const titlesCollection = collection(firestore, "categories");
    await addDoc(titlesCollection, {
      title: categoryTitle,
      creatorUid: userId,
    })
      .then(() => {
        setCategoryTitle('');
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        alert("Error creating category::", error.message);
      });

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

      <TouchableRipple style={styles.createButton} onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>Create Category</Text>
      </TouchableRipple>

      {loading && <ActivityIndicator animating={true} size="large" color="black" />}

    </View>
  );
}
