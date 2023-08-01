import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, Image } from "react-native";
import { FIREBASE_FIRESTORE as firestore, FIREBASE_AUTH } from "../../../firebaseConfig";
import { collection, onSnapshot, writeBatch, query, where, getDocs } from "firebase/firestore";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { deleteUser, getAuth, onAuthStateChanged } from "firebase/auth";
import { styles } from "./style";
import { ImageResource } from "../../resource/imageResource";
import { AntDesign } from '@expo/vector-icons';

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const auth = getAuth();

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfilePicture(user.photoURL);
      }
    });

    setLoading(true);
    return unsubscribe = onSnapshot(collection(firestore, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate("QuizCategory", { category });
  };

  const renderCategoryItem = ({ item }) => (

    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const navigateToOtherScreen = () => {
    navigation.navigate("DetailAccount");
  };


  return (
    <View style={styles.container}>

      <View style={styles.back}>
        <Image source={ImageResource.logo.icon_logo} style={styles.icon_logo} resizeMode="contain" />

        <Text style={styles.icon_text}>Brain Stormer</Text>

        {userProfilePicture ? (
          <View style={styles.logo_container}>
          <TouchableRipple onPress={navigateToOtherScreen}>
             <Image source={{ uri: userProfilePicture }} style={styles.profile_icon_logo} />
          </TouchableRipple>
            </View>
        ) : null}
      </View>

      <View style={styles.categoryItem}>
      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> : <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
      />}
      </View>

     

      
      <AntDesign name="pluscircleo" size={43} onPress={() => navigation.navigate("CreateCategory")} style={ styles.createButton} />

      

    </View>
  );
}

