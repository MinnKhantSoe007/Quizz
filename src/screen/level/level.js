import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';

export default function Level({ navigation, route }) {

  const { category } = route.params;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const quizzesRef = collection(doc(firestore, "categories", category.id), 'quizzes');
  
      try {
        return onSnapshot(quizzesRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Data::", data);
  
          // Extract unique 'level' values
          const uniqueLevels = new Set(data.map(item => item.level));
          const uniqueLevelsArray = Array.from(uniqueLevels);
  
          setCategories(uniqueLevelsArray);
          setLoading(false)
        });
      } catch (error) {
        console.log("Error fetching data:", error);
        setLoading(false)
      }
    };
  
    fetchData();
  }, [category.id]);
  

  const handleLevel = (difficultyLevel, timeLimit) => {
    navigation.navigate("QuizTest", { difficultyLevel, timeLimit, category })
  };

  const renderCategoryItems = ({ item }) => {
    return (
      <View style={styles.level_container}>
        <TouchableOpacity onPress={() => handleLevel(item, 50)}>
          <Text style={styles.level}>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (

    <SafeAreaView style={styles.container}>

      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Category")} />

      <Text style={styles.main_text}>
        Choose Level
      </Text>

      { loading ? <ActivityIndicator animating={true} size="large" color="black" /> : 
      <FlatList
      data={categories}
      renderItem={renderCategoryItems}
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
    />
      }

    </SafeAreaView>
  )
}