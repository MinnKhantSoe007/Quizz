import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function QuizCategory({ navigation, route }) {
  const { category } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(category.id);

  useEffect(() => {
    setLoading(true);
    return unsubscribe = onSnapshot(collection(doc(firestore, "categories", category.id), 'quizzes')
      ,(snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
        setLoading(false);
      });
  }, [category]);

  const handleDeleteCategory = async () => {
    try {
      await deleteDoc(doc(firestore, 'categories', category.id));
      alert('Category deleted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again later.');
    }
  };

  const handleQuizPress = (quiz) => {
    navigation.navigate('EditQuiz', { category, quiz });
  };

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => handleQuizPress(item)}>
    <View style={styles.quizItem}>
      <Text style={styles.quizQuestion}>{item.question}</Text>
      <Text>Options:</Text>
      <Text>{item.options.join(', ')}</Text>
      <Text>Correct Option: {item.correct_option}</Text>
      <Text>Level: {item.level}</Text>
      </View>
      </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=> navigation.navigate("CreateQuiz", { categoryId: category.id })}>
        <Text>
          Create Quiz
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCategory}>
        <Text style={styles.deleteButtonText}>Delete Category</Text>
        </TouchableOpacity>
        
      </TouchableOpacity>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      { loading ? <ActivityIndicator animating={true} size="large" color="black" /> : <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
      /> }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quizItem: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
