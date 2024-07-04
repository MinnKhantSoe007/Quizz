import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, TextInput, Modal } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';

export default function Category({ navigation }) {

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
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

  const handleRefresh = async() => {
    setRefreshing(true);
    await fetchCategories();
    fetchUsers();
    setRefreshing(false);
  }

  const handleCategory = (category) => {
    navigation.navigate("Level", { category });
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
    setSortModalVisible(false);
  };


  const clearSort = () => {
    setFilteredCategories(categories);
    setSortModalVisible(false);
  };

  const renderCategoryItems = ({ item }) => {
    const creatorName = findUserNameByCreatorUid(item.creatorUid);

    return (
      <View style={styles.level_container}>
        <TouchableOpacity onPress={() => handleCategory(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.name}>Created by: {creatorName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderModal = () => (
    <Modal animationType="slide" transparent={true} visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <TouchableOpacity onPress={() => handleSort("category")}>
            <Text style={styles.modalOption}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort("name")}>
            <Text style={styles.modalOption}>Name</Text>
          </TouchableOpacity>
          <TouchableRipple onPress={clearSort} style={styles.modalButton} rippleColor='#ffffff88' borderless={true}>
            <Text style={styles.modalButtonText}>Clear</Text>
          </TouchableRipple>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />

      <TouchableRipple onPress={() => setSortModalVisible(true)} style={styles.sortBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={24} style={styles.sortButtonText} />
        </View>
      </TouchableRipple>

      <Text style={styles.main_text}>
        Choose Category
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color='#5E60CE' style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {renderModal()}

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View style={styles.flatList}>
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
      }
    </SafeAreaView>
  );
}
