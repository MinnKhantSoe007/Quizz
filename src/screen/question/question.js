import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { collection, onSnapshot, where, query } from "firebase/firestore";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { styles } from "./style";
import { ImageResource } from "../../resource/imageResource";
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const auth = getAuth();

  // useEffect(() => {
  //   checkToken();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserProfilePicture(user.photoURL);
        const userId = user.uid;

        setLoading(true);
        const categoriesQuery = query(
          collection(firestore, "categories"),
          where("creatorUid", "==", userId)
        );

        return onSnapshot(categoriesQuery, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCategories(data);
          setLoading(false);
        });
      }
    };

    const unsubscribeAuthStateChange = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCategories([]);
        setUserProfilePicture(null);
      }
    });

    fetchUserData();

    return () => unsubscribeAuthStateChange();
  }, []);

  // const checkToken = async () => {
  //   const user = auth.currentUser;
  //   const token = await user.getIdToken();
  //   await AsyncStorage.setItem('userToken', token);
  //   console.log("Token ::", token);
  // }

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


  return (
    <View style={styles.container}>

      <View style={styles.back}>
        <Image source={ImageResource.logo.icon_logo} style={styles.icon_logo} resizeMode="contain" />

        <Text style={styles.icon_text}>Quiz Lab</Text>

        {userProfilePicture ? (
          <View style={styles.logo_container}>
            <TouchableRipple onPress={navigateToOtherScreen}>
              <Image source={{ uri: userProfilePicture }} style={styles.profile_icon_logo} />
            </TouchableRipple>
          </View>
        ) : <Ionicons name="person-circle-sharp" size={34} color="black" style={styles.logo_container} onPress={navigateToOtherScreen} />}
      </View>

      <View style={styles.categoryItem}>
        {loading ? <ActivityIndicator animating={true} size="large" color="black" /> : <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />}
      </View>

      <TouchableRipple onPress={() => navigation.navigate("CreateCategory")} style={styles.createBtnWrapper} rippleColor='#ffffff88' borderless={true}>
        <View style={styles.createButton} >
          <AntDesign name="plus" size={30} style={styles.plusBtn} />
        </View>
      </TouchableRipple>

    </View>
  );
}

