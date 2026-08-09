import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, FlatList, Alert, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import * as LocalAuthentication from 'expo-local-authentication';
import BackButton from '../../components/BackButton';
import CategoryCard from '../../components/CategoryCard';
import SortSheet from '../../components/SortSheet';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/theme';

export default function Level({ navigation, route }) {

  const { category, studentName, studentYear } = route.params;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [category.id]);

  const authenticateUser = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to play',
    });

    if (result.success) {
      return true;
    } else {
      if (result.error === 'LAErrorUserFallback') {
        console.log('User cancelled authentication and chose passcode.');
      }
      return false;
    }
  };

  const handleLevel = async (difficultyLevel, timeLimit) => {
    if (studentName != "guest") {
      const authenticated = await authenticateUser();
    if (authenticated) {
      navigation.navigate("QuizTest", { difficultyLevel, timeLimit, category });
    } else {
      Alert.alert('Authentication Failed', 'You need to authenticate to play.');
    }
    } else {
      navigation.navigate("QuizTest", { difficultyLevel, timeLimit, category });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const quizzesRef = collection(doc(firestore, "categories", category.id), 'quizzes');

    try {
      return onSnapshot(quizzesRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const currentTime = new Date().toLocaleString();
        // Extract unique 'level' values
        const uniqueLevels = Array.from(new Set(data.map(item => item.level)));

        // Map each unique level to include score, duration, startTime, and endTime
        const formattedCategories = uniqueLevels.map(level => {
          const items = data.filter(item => item.level === level);
          // Assuming all items for a level have the same score, duration, startTime, and endTime
          const item = items[0];
          return {
            level,
            score: parseInt(item.score), // Convert score to integer
            duration: item.duration,
            startTime: item.startTime ?? null, // Parse string to Date
            endTime: item.endTime ?? null // Parse string to Date
          };
        });

        // Filter levels based on startTime, endTime, and studentName
        const filteredLevels = formattedCategories.filter(level => {
          const { startTime, endTime } = level;

          if (studentName === "guest" && endTime) {
            return false; // Hide levels with endTime for guest users
          } else if (startTime && endTime) {
            return currentTime >= startTime && currentTime <= endTime;
          } else if (startTime) {
            return currentTime >= startTime;
          } else if (endTime) {
            return currentTime <= endTime;
          } else {
            return true; // No time restrictions
          }
        });

        setCategories(filteredLevels);
        setFilteredCategories(filteredLevels);
        setLoading(false);
      });
    } catch (error) {
      console.log("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleRefresh = async() => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  const renderCategoryItem = ({ item }) => (
    <CategoryCard
      title={`Level: ${item.level}`}
      subtitle={`Duration: ${item.duration} minutes`}
      tag={item.endTime ? 'Closed' : undefined}
      onPress={() => handleLevel(item.level, item.duration)}
    />
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = categories.filter((category) =>
      category.level.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSort = (sortKey) => {
    const sortedCategories = [...categories].sort((a, b) => {
      if (sortKey === "level") {
        return a.level.localeCompare(b.level); // Sort by level
      } else if (sortKey === "duration") {
        return parseInt(a.duration) - parseInt(b.duration); // Sort by duration (ascending)
      }
      return 0;
    });
    setFilteredCategories(sortedCategories);
    setSortOption(sortKey);
    setSortModalVisible(false);
  };

  const clearSort = () => {
    setFilteredCategories(categories);
    setSortOption('');
    setSortModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.navigate("Category")} style={{ position: 'absolute', left: 0, paddingHorizontal: 0 }} />
        <Text style={styles.headerTitle}>Choose Level</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onFilterPress={() => setSortModalVisible(true)}
      />

      <View style={styles.listContainer}>
        {loading ? (
          <Loader style={styles.loader} />
        ) : filteredCategories.length === 0 ? (
          <Text style={styles.emptyText}>There is no level right now!</Text>
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.level}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {studentName != "guest" && (
        <TouchableOpacity
          style={styles.historyFab}
          onPress={() => navigation.navigate("History", { studentName, studentYear, category, filteredCategories })}
          activeOpacity={0.85}
        >
          <Ionicons name="podium-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      )}

      <SortSheet
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        options={[
          { label: 'Level', value: 'level' },
          { label: 'Duration', value: 'duration' },
        ]}
        value={sortOption}
        onSelect={handleSort}
        onClear={clearSort}
      />
    </SafeAreaView>
  );
}
