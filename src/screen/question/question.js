import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  where,
  query,
  getDocs,
  addDoc,
  writeBatch,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import InputField from '../../components/InputField';
import CategoryCard from '../../components/CategoryCard';
import SortSheet from '../../components/SortSheet';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/ConfirmDialog';
import DropdownMenu from '../../components/DropdownMenu';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Colors } from '../../theme/theme';
import { styles } from './style';

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryNameList, setCategoryNameList] = useState([]);
  const [creating, setCreating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);
  const auth = getAuth();
  const { toastMessage, showToast } = useToast();

  const fetchCategoriesWithCounts = useCallback((userId) => {
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

  const closeMenu = () => setMenuVisible(false);

  const handleUpdateProfile = () => {
    closeMenu();
    navigation.navigate('UpdateAccount');
  };

  const handleSignOutPress = () => {
    closeMenu();
    setSignOutModalVisible(true);
  };

  const handleConfirmSignOut = async () => {
    setSignOutModalVisible(false);
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteProfilePress = () => {
    closeMenu();
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user = auth.currentUser;
      const categoriesQuery = query(
        collection(firestore, 'categories'),
        where('creatorUid', '==', user.uid)
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);

      const batch = writeBatch(firestore);
      categoriesSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();
      await deleteUser(user);

      setDeleteModalVisible(false);
      navigation.navigate('Home');
    } catch (error) {
      setDeleteModalVisible(false);
      showToast(error.message);
    }
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
    setSortOption(option);
    setSortModalVisible(false);
  };

  const clearSort = () => {
    setFilteredCategories(categories);
    setSortOption('');
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
      showToast('Please enter a deck name or select a category.');
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
      showToast('Error creating category.');
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <CategoryCard
      badge={item.title}
      title={item.title}
      subtitle={`${item.quizCount ?? 0} Quiz${(item.quizCount ?? 0) === 1 ? '' : 's'}`}
      tag={item.title}
      onPress={() => handleCategoryPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.75}>
          {userProfilePicture ? (
            <Image source={{ uri: userProfilePicture }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-sharp" size={40} color={Colors.primary} />
          )}
        </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={openAddModal}
        activeOpacity={0.85}
      >
        <AntDesign name="plus" size={28} color={Colors.white} />
      </TouchableOpacity>

      <SortSheet
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        options={[
          { label: 'Ascending Order', value: 'Ascending Order' },
          { label: 'Descending Order', value: 'Descending Order' },
        ]}
        value={sortOption}
        onSelect={handleSort}
        onClear={clearSort}
      />

      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.addModalCard}>
            <View style={styles.sheetHandle} />
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

      <DropdownMenu
        visible={menuVisible}
        onClose={closeMenu}
        items={[
          { label: 'Update Profile', onPress: handleUpdateProfile },
          { label: 'Sign Out', onPress: handleSignOutPress },
          { label: 'Delete Profile', onPress: handleDeleteProfilePress, danger: true },
        ]}
      />

      <ConfirmDialog
        visible={deleteModalVisible}
        message="All data including your account will be deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <ConfirmDialog
        visible={signOutModalVisible}
        message="You will be logged out of your account."
        confirmLabel="Sign Out"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutModalVisible(false)}
      />

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
