import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../components/BackButton';
import CategoryCard from '../../components/CategoryCard';
import SearchBar from '../../components/SearchBar';
import SortSheet from '../../components/SortSheet';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/theme';

export default function QuizCategory({ navigation, route }) {
  const { category } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const fetchQuizzes = useCallback(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(doc(firestore, "categories", category.id), 'quizzes'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const uniqueLevels = Array.from(new Set(data.map(item => item.level)));
        setFilteredCategories(uniqueLevels);
        setQuizzes(data);
        setFilteredQuizzes(data);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [category.id]);

  useEffect(() => {
    const unsubscribe = fetchQuizzes();
    return () => unsubscribe();
  }, [fetchQuizzes]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchQuizzes();
    setRefreshing(false);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteDoc(doc(firestore, 'categories', category.id));
      navigation.goBack();
    } catch (error) {
      setDeleteModalVisible(false);
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
      }
      return a.score - b.score;
    });
    setFilteredQuizzes(sortedQuizzes);
    setSortOption(sortKey);
    setSortModalVisible(false);
  };

  const clearSort = () => {
    setFilteredQuizzes(quizzes);
    setSortOption('');
    setSortModalVisible(false);
  };

  const renderQuizItem = ({ item }) => (
    <CategoryCard
      title={`Question: ${item.question}`}
      subtitle={`Level: ${item.level}`}
      tag={`${item.score} Marks`}
      onPress={() => handleQuizPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton fallbackRoute="Question" style={{ paddingHorizontal: 0 }} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {category.title}
        </Text>
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)} activeOpacity={0.75}>
          <Ionicons name="trash-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search questions..."
        onFilterPress={() => setSortModalVisible(true)}
      />

      <View style={styles.listContainer}>
        {loading ? (
          <Loader style={styles.loader} />
        ) : filteredQuizzes.length === 0 ? (
          <Text style={styles.emptyText}>There is no question present.</Text>
        ) : (
          <FlatList
            data={filteredQuizzes}
            renderItem={renderQuizItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.historyFab}
        onPress={() =>
          navigation.navigate('History', {
            studentName: 'guest',
            studentYear: 'guest',
            category,
            filteredCategories,
          })
        }
        activeOpacity={0.85}
      >
        <Ionicons name="podium-outline" size={24} color={Colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateQuiz', { categoryId: category.id })}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <SortSheet
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        options={[
          { label: 'Questions', value: 'question' },
          { label: 'Scores', value: 'score' },
          { label: 'Levels', value: 'level' },
        ]}
        value={sortOption}
        onSelect={handleSort}
        onClear={clearSort}
      />

      <ConfirmDialog
        visible={deleteModalVisible}
        message="All quizzes in this category will be deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}
