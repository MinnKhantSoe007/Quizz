import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FIREBASE_AUTH as auth, FIREBASE_STORAGE as storage } from "../../../firebaseConfig";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UpdateAccount({ navigation }) {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState("");
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
      setSelectedProfilePicture(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      let photoURL = user.photoURL;
  
      if (currentPassword.trim() !== "") {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }
  
      // Upload the selected profile picture to Firebase Storage
      if (selectedProfilePicture) {
        const response = await fetch(selectedProfilePicture);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
        const uploadTask = await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(uploadTask.ref);
      }
  
      // Update the user's profile with the new name and photoURL
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });
  
      alert("Profile updated successfully.");
      navigation.navigate("Home");
  
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

      <Text style={styles.text}>Update Account</Text>

      <View style={styles.photoContainer}>
        <TouchableOpacity style={styles.photoButton} onPress={handleSelectProfilePicture}>

          <Text style={styles.photoButtonText}>Select Picture</Text>

        </TouchableOpacity>

        {selectedProfilePicture ? <Image source={{ uri: selectedProfilePicture }} style={styles.selectedPic} /> : null}
      </View>



      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="black" />
      ) : (
        <TouchableOpacity style={styles.createButton} onPress={handleUpdateProfile}>
          <Text style={styles.createButtonText}>Update Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
