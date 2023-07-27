import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { FIREBASE_FIRESTORE as firestore, FIREBASE_AUTH } from "../../../firebaseConfig";
import { collection, onSnapshot} from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
import { deleteUser } from "firebase/auth";

export default function Question({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleDeleteAccount = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      await deleteUser(user);
      alert('Account deleted successfully.');
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }};


  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={()=> navigation.navigate("CreateCategory")}>
        <Text>
          Create Category
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
      
      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> : <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
      />}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

modalView: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 9,
  },

  success: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
  },

  check: {
    fontFamily: 'RobotoRegular',
    marginTop: 5,
  },

  ok: {
    fontFamily: 'RobotoRegular',
    color: '#5E60CE',
    fontSize: 20,
    marginTop: 10
  },
});
