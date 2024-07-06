import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper"
import { Picker } from "@react-native-picker/picker";

export default function CreateCategory({ navigation }) {
  const [categoryTitle, setCategoryTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryNameList, setCategoryNameList] = useState([])

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    const fetchCategoryNameLists = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categoryNameList'));
        let categoriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        categoriesData.sort((a, b) => a.title.localeCompare(b.title));

        setCategoryNameList(categoriesData);
        if (categoriesData.length > 0) {
          setCategoryTitle(categoriesData[0].title);
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching categoryNameList:', error);
        setLoading(false);
      }
    };

    fetchCategoryNameLists();
  }, []);

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

      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Question")} />

      <Text style={styles.label}>Category Title:</Text>
      {
        loading ? <ActivityIndicator animating={true} size="large" color="black" /> : 

        <Picker
        style = {styles.input}
          selectedValue={categoryTitle}
          onValueChange={(itemValue, itemIndex) => setCategoryTitle(itemValue)}
        >
          {categoryNameList.map((category) => (
            <Picker.Item key={category.id} label={category.title} value={category.title} />
          ))}
        </Picker>
      }

      <TouchableRipple style={styles.createButton} onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>Create Category</Text>
      </TouchableRipple>

    </View>
  );
}
