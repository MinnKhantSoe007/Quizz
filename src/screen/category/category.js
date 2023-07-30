import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';

export default function Category({ navigation }) {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categories'));
        const categoriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategory = (category) => {
    navigation.navigate("Level", { category })
    console.log("categories::", category);
  }

  const renderCategoryItems = ({ item }) => {
    return (
      <View style={styles.level_container}>
        <TouchableOpacity onPress={() => handleCategory(item)}>
          <Text style={styles.level}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )

  }

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />
      <Text style={styles.main_text}>
        Choose Category
      </Text>
      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View style={styles.flatList}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItems}
            keyExtractor={item => item.id}
          />
        </View>
      }

    </SafeAreaView>
  )
}