import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  where,
  query,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import InputField from '../../components/InputField';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../theme/theme';
import { styles } from './style';

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryNameList, setCategoryNameList] = useState([]);
  const [creating, setCreating] = useState(false);
  const auth = getAuth();

  const fetchCategoriesWithCounts = useCallback(async (userId) => {
    const categoriesQuery = query(
      collection(firestore, 'categories'),
      where('creatorUid', '==', userId)
    );

    return onSnapshot(categoriesQuery, async (snapshot) => {
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const quizzesSnap = await getDocs(
            collection(firestore, 'categories', docSnap.id, 'quizzes')
          );
          return {
            id: docSnap.id,
            ...docSnap.data(),
            quizCount: quizzesSnap.size,
          };
        })
      );
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let unsubscribeCategories;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCategories([]);
        setFilteredCategories([]);
        setUserProfilePicture(null);
        return;
      }

      if (user.photoURL) {
        setUserProfilePicture(user.photoURL);
      }

      setLoading(true);
      unsubscribeCategories = fetchCategoriesWithCounts(user.uid);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCategories) unsubscribeCategories();
    };
  }, [auth, fetchCategoriesWithCounts]);

  useEffect(() => {
    const fetchCategoryNameLists = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categoryNameList'));
        const categoriesData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => a.title.localeCompare(b.title));

        setCategoryNameList(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].title);
        }
      } catch (error) {
        console.log('Error fetching categoryNameList:', error);
      }
    };

    fetchCategoryNameLists();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleSearch = (queryText) => {
    setSearchQuery(queryText);

    if (queryText === '') {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((item) =>
      item.title.toLowerCase().includes(queryText.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('QuizCategory', { category });
  };

  const navigateToOtherScreen = () => {
    navigation.navigate('DetailAccount');
  };

  const mergeSort = (arr, sortOrder) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), sortOrder);
    const right = mergeSort(arr.slice(mid), sortOrder);
    return merge(left, right, sortOrder);
  };

  const merge = (left, right, sortOrder) => {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (
        (sortOrder === 'Ascending Order' && left[leftIndex].title <= right[rightIndex].title) ||
        (sortOrder === 'Descending Order' && left[leftIndex].title >= right[rightIndex].title)
      ) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  const handleSort = (option) => {
    let sortedCategories = [...filteredCategories];

    if (option === 'Ascending Order' || option === 'Descending Order') {
      sortedCategories = mergeSort(sortedCategories, option);
    }

    setFilteredCategories(sortedCategories);
    setSortModalVisible(false);
  };

  const clearSort = () => {
    setFilteredCategories(categories);
    setSortModalVisible(false);
  };

  const openAddModal = () => {
    setDeckName('');
    if (categoryNameList.length > 0) {
      setSelectedCategory(categoryNameList[0].title);
    }
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    setDeckName('');
  };

  const handleCreateCategory = async () => {
    const title = deckName.trim() || selectedCategory;

    if (!title) {
      alert('Please enter a deck name or select a category.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setCreating(true);
    try {
      await addDoc(collection(firestore, 'categories'), {
        title,
        creatorUid: user.uid,
      });
      closeAddModal();
    } catch (error) {
      alert('Error creating category.');
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const getInitials = (title) => {
    if (!title) return '?';
    const words = title.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item)}
      style={styles.card}
      activeOpacity={0.75}
    >
      <View style={styles.cardBadge}>
        <Text style={styles.cardBadgeText}>{getInitials(item.title)}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>
          {item.quizCount ?? 0} Quiz{(item.quizCount ?? 0) === 1 ? '' : 's'}
        </Text>
      </View>

      <Text style={styles.cardTag} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <TouchableOpacity onPress={navigateToOtherScreen} activeOpacity={0.75}>
          {userProfilePicture ? (
            <Image source={{ uri: userProfilePicture }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-sharp" size={40} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.black} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Catagories"
            placeholderTextColor={Colors.textPlaceholder}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSortModalVisible(true)}
          activeOpacity={0.75}
        >
          <Ionicons name="options-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator animating size="large" color={Colors.primary} style={styles.loader} />
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

      <TouchableOpacity
        style={styles.fab}
        onPress={openAddModal}
        activeOpacity={0.85}
      >
        <AntDesign name="plus" size={28} color={Colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => handleSort('Ascending Order')}>
              <Text style={styles.modalOption}>Ascending Order</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort('Descending Order')}>
              <Text style={styles.modalOption}>Descending Order</Text>
            </TouchableOpacity>
            <AppButton label="Clear" onPress={clearSort} variant="outline" style={styles.modalButton} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={addModalVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModalCard}>
            <Text style={styles.addModalTitle}>Add Categories</Text>

            <InputField
              label="Custom Category"
              placeholder="Enter your custom name"
              value={deckName}
              onChangeText={setDeckName}
            />

            <Text style={styles.listLabel}>Categories Title</Text>
            <ScrollView style={styles.categoryList} showsVerticalScrollIndicator>
              {categoryNameList.map((category) => {
                const isSelected = selectedCategory === category.title;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                    onPress={() => setSelectedCategory(category.title)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        isSelected && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <AppButton
              label="Create"
              onPress={handleCreateCategory}
              variant="filled"
              loading={creating}
              style={styles.modalActionButton}
            />
            <AppButton
              label="Cancel"
              onPress={closeAddModal}
              variant="outline"
              disabled={creating}
              style={styles.modalActionButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
