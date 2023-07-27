import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";

export default function CreateCategory({ navigation }) {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
    const user = auth.currentUser;
  const userId = user ? user.uid : null;
  console.log(userId);

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
