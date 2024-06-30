import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuizCategory({ navigation, route }) {
  const { category } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(doc(firestore, "categories", category.id), 'quizzes'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
        setFilteredQuizzes(data);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [category]);

  const deleteCategory = () => {
    setModal(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteDoc(doc(firestore, 'categories', category.id));
      navigation.goBack();
    } catch (error) {
      alert('Failed to delete category. Please try again later.');
    }
  };

  const handleQuizPress = (quiz) => {
    navigation.navigate('EditQuiz', { category, quiz });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredQuizzes(quizzes);
    } else {
      const filteredData = quizzes.filter((quiz) =>
        quiz.question.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuizzes(filteredData);
    }
  };

  const handleSort = (sortKey) => {
    const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
      if (sortKey === "question" || sortKey === "level") {
        return a[sortKey].localeCompare(b[sortKey]);
      } else if (sortKey === "score") {
        return a[sortKey] - b[sortKey];
      }
    });
    setFilteredQuizzes(sortedQuizzes);
    setSortModalVisible(false);
  };



  const clearSort = () => {
    setFilteredQuizzes(quizzes);
    setSortModalVisible(false);
  };

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => handleQuizPress(item)}>
      <Text style={styles.quizQuestion}>Question: {item.question}</Text>
      <Text style={styles.quizScore}>Level: {item.level}</Text>
      <Text style={styles.quizScore}>Score: {item.score}</Text>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal animationType="slide" transparent={true} visible={modal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.success}>Are you sure?</Text>
          <Text style={styles.check}>All quizzes in this category will be deleted.</Text>
          <TouchableOpacity onPress={handleDeleteCategory}>
            <Text style={styles.ok}>Okay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModal(false)}>
            <Text style={styles.no}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Question")} />
      <Text style={styles.categoryTitle}>Category: {category.title}</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color='#5E60CE' style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="black" />
      ) : (
        filteredQuizzes.length === 0 ?
          <Text style={styles.noCategoryText}>There is no question present.</Text> :
          <View style={styles.list}>
            <FlatList
              data={filteredQuizzes}
              renderItem={renderQuizItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
      )}
      {renderModal()}
      <TouchableRipple onPress={deleteCategory} style={styles.deleteBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <MaterialCommunityIcons name="delete-circle" size={40} style={styles.deleteBtn} />
      </TouchableRipple>
      <TouchableRipple onPress={() => navigation.navigate("CreateQuiz", { categoryId: category.id })} style={styles.createBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.createButton}>
          <AntDesign name="plus" size={30} style={styles.plusBtn} />
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setSortModalVisible(true)} style={styles.sortBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={24} style={styles.sortButtonText} />
        </View>
      </TouchableRipple>
      <Modal animationType="slide" transparent={true} visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => handleSort("question")}>
              <Text style={styles.modalOption}>Questions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort("score")}>
              <Text style={styles.modalOption}>Scores</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort("level")}>
              <Text style={styles.modalOption}>Levels</Text>
            </TouchableOpacity>
            <TouchableRipple onPress={clearSort} style={styles.modalButton} rippleColor='#ffffff88' borderless={true}>
              <Text style={styles.modalButtonText}>Clear</Text>
            </TouchableRipple>
          </View>
        </View>
      </Modal>
    </View>
  );
}
