import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';

export default function QuizCategory({ navigation, route }) {
  const { category } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    return unsubscribe = onSnapshot(collection(doc(firestore, "categories", category.id), 'quizzes')
      ,(snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
        setLoading(false);
      });
  }, [category]);

  const deleteCategory = () => {
    setModal(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteDoc(doc(firestore, 'categories', category.id));
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
      <Text style={styles.quizQuestion}>Question: {item.question}</Text>
      <Text style={styles.quizOption}>Options:</Text>
      <Text style={styles.quizOptions}>{item.options.join(', ')}</Text>
      <Text style={styles.quizCorrectOption}>Correct Option: {item.correct_option}</Text>
      <Text style={styles.quizLevel}>Level: {item.level}</Text>
      </TouchableOpacity>
  );

  const renderModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <Text style={styles.success}>
                Are you sure?
              </Text>

              <Text style={styles.check}>
                All quizes in this category will be deleted.
              </Text>

              <TouchableOpacity onPress={handleDeleteCategory}>
                <Text style={styles.ok}>
                  Okay
                </Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModal(false)}>
                <Text style={styles.no}>
                  No
                </Text>

              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
  };


  return (
    <View style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Question")} />
      
      <TouchableOpacity onPress={()=> navigation.navigate("CreateQuiz", { categoryId: category.id })} style={styles.createButton}>
        <Text style={styles.createButtonText}>
          Create Quiz
        </Text>
      </TouchableOpacity>
     
      <Text style={styles.categoryTitle}>Category: {category.title} </Text>

      { loading ? <ActivityIndicator animating={true} size="large" color="black" /> : <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
      />}

      {renderModal()}
      
      <TouchableOpacity style={styles.deleteButton} onPress={deleteCategory}>
        <Text style={styles.deleteButtonText}>Delete Category</Text>
        </TouchableOpacity>
      
    </View>
  );
}
