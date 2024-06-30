import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TextInput, Modal, TouchableOpacity } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { styles } from "./style";
import { ImageResource } from "../../resource/imageResource";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      const userId = user.uid;

      if (user.photoURL) {
        setUserProfilePicture(user.photoURL);
      }

      if (user) {
        setLoading(true);

        const categoriesQuery = query(
          collection(firestore, "categories"),
          where("creatorUid", "==", userId)
        );

        return onSnapshot(categoriesQuery, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCategories(data);
          setFilteredCategories(data);
          setLoading(false);
        });
      }
    };

    const unsubscribeAuthStateChange = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCategories([]);
        setFilteredCategories([]);
        setUserProfilePicture(null);
      }
    });

    fetchUserData();

    return () => unsubscribeAuthStateChange();
  }, []);

  // Function to perform binary search on an array of categories
  const binarySearch = (arr, x) => {
    let start = 0, end = arr.length - 1;

    // Loop until start index is less than or equal to end index
    while (start <= end) {
      const mid = Math.floor((start + end) / 2); // Calculate mid index

      // Check if the title at mid index contains the search query (case insensitive)
      if (arr[mid].title.toLowerCase().includes(x.toLowerCase())) {
        return mid; // Return the index of the matching category
      }

      // If current title is less than search query, adjust start index
      if (arr[mid].title.toLowerCase() < x.toLowerCase()) {
        start = mid + 1;
      } else { // Otherwise, adjust end index
        end = mid - 1;
      }
    }
    return -1; // Return -1 if no match is found
  };

  // Function to handle search query input
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query state

    // If search query is empty, display all categories
    if (query === "") {
      setFilteredCategories(categories);
    } else {
      // Sort categories alphabetically by title
      const sortedCategories = [...categories].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      // Perform binary search on sorted categories to find matching category
      const index = binarySearch(sortedCategories, query);

      if (index !== -1) {
        // Set filtered categories to contain only the matching category
        setFilteredCategories([sortedCategories[index]]);
      } else {
        // Set filtered categories to empty array if no match is found
        setFilteredCategories([]);
      }
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate("QuizCategory", { category });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableRipple onPress={() => handleCategoryPress(item)} style={styles.itemWrapper} rippleColor={'#00000055'} borderless={true}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableRipple>
  );

  const navigateToOtherScreen = () => {
    navigation.navigate("DetailAccount");
  };

  const handleSortModal = () => {
    setSortModalVisible(true);
  };

  const closeModal = () => {
    setSortModalVisible(false);
  };

  // Merge sort function to sort categories by title
  const mergeSort = (arr, sortOrder) => {
    // Base case: If the array length is 0 or 1, it is already sorted
    if (arr.length <= 1) {
      return arr;
    }

    // Divide the array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), sortOrder); // Recursively sort the left half
    const right = mergeSort(arr.slice(mid), sortOrder); // Recursively sort the right half

    // Merge the sorted left and right halves using the merge function
    return merge(left, right, sortOrder);
  };

  // Merge function to merge two sorted arrays based on sortOrder
  const merge = (left, right, sortOrder) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Compare elements from left and right arrays and merge them into result
    while (leftIndex < left.length && rightIndex < right.length) {
      if (
        (sortOrder === "Ascending Order" && left[leftIndex].title <= right[rightIndex].title) ||
        (sortOrder === "Descending Order" && left[leftIndex].title >= right[rightIndex].title)
      ) {
        result.push(left[leftIndex]); // Add element from left array to result
        leftIndex++; // Move to the next element in left array
      } else {
        result.push(right[rightIndex]); // Add element from right array to result
        rightIndex++; // Move to the next element in right array
      }
    }

    // Append remaining elements from left and right arrays to result
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  // Function to handle sorting categories based on selected option using merge sort
  const handleSort = (option) => {
    let sortedCategories = [...filteredCategories]; // Copy filtered categories

    // Sort categories based on selected option using merge sort
    if (option === "Ascending Order" || option === "Descending Order") {
      sortedCategories = mergeSort(sortedCategories, option);
    }

    setFilteredCategories(sortedCategories); // Update filtered categories with sorted results
    setSortModalVisible(false); // Close the sort modal
  };


  const clearSort = () => {
    setFilteredCategories(categories); // Reset to original unsorted categories
    setSortModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.back}>
        <Image source={ImageResource.logo.icon_logo} style={styles.icon_logo} resizeMode="contain" />
        <Text style={styles.icon_text}>Quiz Lab</Text>
        {userProfilePicture ? (
          <View style={styles.logo_container}>
            <TouchableRipple onPress={navigateToOtherScreen}>
              <Image source={{ uri: userProfilePicture }} style={styles.profile_icon_logo} />
            </TouchableRipple>
          </View>
        ) : <Ionicons name="person-circle-sharp" size={34} color='#5E60CE' style={styles.logo_container} onPress={navigateToOtherScreen} />}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color='#5E60CE' style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.categoryItem}>
        {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
          filteredCategories.length === 0 ? (
            <Text style={styles.noCategoryText}>There is no category present.</Text>
          ) : (
            <FlatList
              data={filteredCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
      </View>

      <TouchableRipple onPress={() => navigation.navigate("CreateCategory")} style={styles.createBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.createButton}>
          <AntDesign name="plus" size={30} style={styles.plusBtn} />
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleSortModal} style={styles.sortBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={24} style={styles.sortButtonText} />
        </View>
      </TouchableRipple>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => handleSort("Ascending Order")}>
              <Text style={styles.modalOption}>Ascending Order</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort("Descending Order")}>
              <Text style={styles.modalOption}>Descending Order</Text>
            </TouchableOpacity>
            <TouchableRipple onPress={clearSort} style={styles.modalButton} rippleColor='#ffffff88' borderless={true}>
              <Text style={styles.modalButtonText}>Clear</Text>
            </TouchableRipple>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}