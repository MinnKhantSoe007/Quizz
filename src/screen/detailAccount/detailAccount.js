import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FIREBASE_FIRESTORE as firestore, FIREBASE_AUTH } from "../../../firebaseConfig";
import { collection, writeBatch, query, where, getDocs } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { TouchableRipple } from "react-native-paper";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function DetailAccount({ navigation }) {

  const [modal, setModal] = useState(false);
  const [signModal, setSignModal] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      const userId = user.uid;

      const categoriesRef = collection(firestore, "categories");
      const batch = writeBatch(firestore);

      const categoriesQuery = query(categoriesRef, where("creatorUid", "==", userId));
      const categoriesSnapshot = await getDocs(categoriesQuery);

      categoriesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      await deleteUser(user);

      alert('Account and related data deleted successfully.');
      navigation.navigate("Home");

    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteAccount = () => {
    setModal(true);
  };

  const signOut = () => {
    setSignModal(true);
  };

  const renderModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.success}>
                Are you sure?
              </Text>

              <Text style={styles.check}>
                All data including your account will be deleted.
              </Text>

              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={styles.ok}>
                  Okay
                </Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModal(false)}>
                <Text style={styles.no}>
                  No
                </Text>

              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
  };

  const renderSignModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={signModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <Text style={styles.success}>
                Are you sure?
              </Text>

              <Text style={styles.check}>
                You will be logged out of your account.
              </Text>

              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.ok}>
                  Okay
                </Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSignModal(false)}>
                <Text style={styles.no}>
                  No
                </Text>

              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
  };

  return (
    <View style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Question")} />

      <TouchableRipple style={styles.button} onPress={()=> navigation.navigate("UpdateAccount")}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableRipple>

      <TouchableRipple style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableRipple>

      <TouchableRipple style={styles.deleteButton} onPress={deleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Profile</Text>
      </TouchableRipple>

      {renderModal()}

      {renderSignModal()}

    </View>
  );
}
