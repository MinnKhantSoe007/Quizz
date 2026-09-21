import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_AUTH as auth, FIREBASE_STORAGE as storage } from "../../../firebaseConfig";
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import AvatarPicker from '../../components/AvatarPicker';
import Toast from '../../components/Toast';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useToast } from '../../hooks/useToast';
import { styles } from "./style";

export default function UpdateAccount({ navigation }) {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [existingPhotoURL, setExistingPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const { uri: pickedPhoto, pickImage } = useImagePicker();
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName);
      setExistingPhotoURL(user.photoURL);
    }
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      let photoURL = existingPhotoURL;

      if (currentPassword.trim() !== "") {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      // Upload the newly picked profile picture to Firebase Storage
      if (pickedPhoto) {
        const response = await fetch(pickedPhoto);
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

      Alert.alert("Success", "Profile updated successfully.");
      navigation.navigate("Home");

    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={loading} fallbackRoute="DetailAccount" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <AvatarPicker uri={pickedPhoto || existingPhotoURL} onPress={pickImage} disabled={loading} />
          <Text style={styles.title}>Update Account</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <InputField label="Name" placeholder="Enter your name" value={name} onChangeText={setName} />

          <InputField
            label="Current Password"
            placeholder="*****************"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
          />

          <InputField
            label="New Password"
            placeholder="*****************"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />

          <AppButton
            label="Update Account"
            onPress={handleUpdateProfile}
            variant="filled"
            loading={loading}
            style={styles.actionButton}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
