import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';
import CategoryCard from '../../components/CategoryCard';
import SortSheet from '../../components/SortSheet';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/theme';

export default function Category({ navigation }) {

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [refreshing, setRefreshing] = useState(false)
  const [studentName, setStudentName] = useState("")
  const [studentYear, setStudentYear] = useState("")

  useEffect(() => {
    AsyncStorage.getItem('studentYear').then((data) => setStudentYear(data))
    AsyncStorage.getItem('studentName').then((data) => setStudentName(data))
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const categoriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error fetching Users:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    fetchUsers();
    setRefreshing(false);
  }

  const handleCategory = (category) => {
    navigation.navigate("Level", { category, studentName, studentYear });
  };

  const findUserNameByCreatorUid = (creatorUid) => {
    const user = users.find(user => user.creatorUid === creatorUid);
    return user ? user.name : "Unknown User";
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredCategories(categories);
    } else {
      const filteredData = categories.filter((category) =>
        category && category.title && category.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filteredData);
    }
  };

  const handleSort = (sortKey) => {
    const sortedCategories = [...filteredCategories].sort((a, b) => {
      if (sortKey === "category") {
        return a.title.localeCompare(b.title); // Sort by category title
      } else if (sortKey === "name") {
        const creatorNameA = findUserNameByCreatorUid(a.creatorUid);
        const creatorNameB = findUserNameByCreatorUid(b.creatorUid);
        return creatorNameA.localeCompare(creatorNameB); // Sort by creator name
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

  const renderCategoryItem = ({ item }) => {
    const creatorName = findUserNameByCreatorUid(item.creatorUid);

    return (
      <CategoryCard
        badge={item.title}
        title={item.title}
        subtitle={`Created by ${creatorName}`}
        onPress={() => handleCategory(item)}
      />
    );
  };

  const handleBackButton = async () => {
    if (studentName || studentYear) {
      await AsyncStorage.setItem("studentName", "guest")
      await AsyncStorage.setItem("studentYear", "guest")
    }
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={handleBackButton} style={{ paddingHorizontal: 0 }} />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome{studentName ? ` ${studentName}` : ''}!</Text>
        <Ionicons name="person-circle-sharp" size={40} color={Colors.primary} />
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
          <Text style={styles.emptyText}>There is no category present.</Text>
        ) : (
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <SortSheet
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        options={[
          { label: 'Category', value: 'category' },
          { label: 'Name', value: 'name' },
        ]}
        value={sortOption}
        onSelect={handleSort}
        onClear={clearSort}
      />
    </SafeAreaView>
  );
}
