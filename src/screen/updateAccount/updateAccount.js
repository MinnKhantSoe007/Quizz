import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FIREBASE_AUTH as auth, FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { updateProfile, getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function UpdateAccount({ navigation }) {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setName(user.displayName);
          setProfilePicture(user.photoURL);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSelectProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;

      if (currentPassword.trim() !== "") {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }
      console.log("Password updated successfully.");

      await updateProfile(user, {
        displayName: name,
        photoURL: profilePicture,
      });

      console.log("Profile picture updated successfully.");

      alert("Successfully updated");
      navigation.navigate("Question");

    } catch (error) {
      console.error("Error updating::", error);
    }
  }

  return (
    <View style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

      <Text style={styles.auth_text}>Update Account</Text>

      <TextInput
        style={styles.create_input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.create_input}
        placeholder="Current Password"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* New Input for New Password */}
      <TextInput
        style={styles.create_input}
        placeholder="New Password"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Profile Picture */}
      <TouchableOpacity style={styles.profilePictureButton} onPress={handleSelectProfilePicture}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <View style={styles.defaultProfilePicture}>
            <Text style={styles.defaultProfilePictureText}>Select Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="black" />
      ) : (
        <TouchableOpacity style={styles.update_button} onPress={handleUpdateProfile}>
          <Text style={styles.update_button_text}>Update Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
