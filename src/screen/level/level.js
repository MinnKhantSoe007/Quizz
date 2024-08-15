import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, TextInput, Modal, Alert } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Level({ navigation, route }) {

  const { category, studentName, studentYear } = route.params;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [biometricsEnrolled, setBiometricsEnrolled] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await fetchData();
      checkBiometricSupport();
    };
    initialize();
  }, [category.id]);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    console.log("Compatible::", compatible, enrolled);
    setBiometricsSupported(compatible);
    setBiometricsEnrolled(enrolled);
  };

  const authenticateUser = async () => {
    const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
  
    // Check for Face ID/Touch ID availability
    const isFaceIDAvailable = supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    const isTouchIDAvailable = supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    const isIrisIDAvailable = supportedBiometrics.includes(LocalAuthentication.AuthenticationType.IRIS);
  
    let options = {
      promptMessage: 'Authenticate to play',
    };
  // console.log(isTouchIDAvailable);
    // Prioritize Face ID/Touch ID if available
    // if (isFaceIDAvailable) {
    //   options.cancelLabel = 'Use Passcode';
    //   options.authenticationType = LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    // } else if (isTouchIDAvailable) {
    //   options.cancelLabel = 'Use Passcode';
    //   options.authenticationType = LocalAuthentication.AuthenticationType.FINGERPRINT
    // }
  
    const result = await LocalAuthentication.authenticateAsync(options);
  
    if (result.success) {
      return true;
    } else {
      // Handle authentication failure or cancellation
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

  const renderCategoryItems = ({ item }) => {
    return (
      <View style={item.endTime ? styles.level_containered : styles.level_container}>
        <TouchableOpacity onPress={() => handleLevel(item.level, item.duration)}>
          <Text style={styles.level}>Level: {item.level}</Text>
          <View style={styles.score_container}>
            {/* <Text style={styles.score}>Score: {item.score}</Text> */}
            <Text style={styles.score}>Duration: {item.duration} minutes</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredCategories = categories.filter((category) =>
      category.level.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filteredCategories);
  };

  const handleSort = (sortKey) => {
    const sortedCategories = [...categories].sort((a, b) => {
      if (sortKey === "level") {
        return a.level.localeCompare(b.level); // Sort by level
      } else if (sortKey === "score") {
        return a.score - b.score; // Sort by score (ascending)
      } else if (sortKey === "duration") {
        return parseInt(a.duration) - parseInt(b.duration); // Sort by duration (ascending)
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

  const renderModal = () => (
    <Modal animationType="slide" transparent={true} visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <TouchableOpacity onPress={() => handleSort("level")}>
            <Text style={styles.modalOption}>Level</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => handleSort("score")}>
            <Text style={styles.modalOption}>Score</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => handleSort("duration")}>
            <Text style={styles.modalOption}>Duration</Text>
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
      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Category")} />
      <TouchableRipple onPress={() => navigation.navigate("History")} style={styles.historyBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.historyButton}>
          <Ionicons name="podium-outline" size={24} style={styles.historyButtonText} />
        </View>
      </TouchableRipple>

      <Text style={styles.main_text}>
        Choose Level
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color='#5E60CE' style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search levels..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <TouchableRipple onPress={() => setSortModalVisible(true)} style={styles.sortBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={24} style={styles.sortButtonText} />
        </View>
      </TouchableRipple>

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItems}
          keyExtractor={(item) => item.level}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }

      {renderModal()}

    </SafeAreaView>
  );
}
