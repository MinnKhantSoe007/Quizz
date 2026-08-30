import React, { useState } from 'react';
import { Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_AUTH as auth, FIREBASE_STORAGE as storage, FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import AvatarPicker from '../../components/AvatarPicker';
import Toast from '../../components/Toast';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useToast } from '../../hooks/useToast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './style';

export default function CreateAccount({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [accModal, setAccModal] = useState(false);
  const { uri: profilePicture, pickImage } = useImagePicker();
  const { toastMessage, showToast } = useToast();

  const createAccount = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;

      let photoURL = '';
      if (profilePicture) {
        const responseUserId = user.uid;
        const imageName = `profilePictures/${responseUserId}.jpg`;
        const imageResponse = await fetch(profilePicture);
        const blob = await imageResponse.blob();
        const storageRef = ref(storage, imageName);
        const uploadTask = await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(uploadTask.ref);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      const usersCollection = collection(firestore, 'users');
      await addDoc(usersCollection, {
        name,
        email,
        creatorUid: user.uid,
        photoURL,
      });

      await sendEmailVerification(user);
      setAccModal(true);
    } catch (error) {
      console.error('Error creating account:', error);
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={loading} fallbackRoute="Auth" />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <AvatarPicker uri={profilePicture} onPress={pickImage} disabled={loading} />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <InputField
          label="Email"
          placeholder="Contact@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <InputField
          label="Password"
          placeholder="*****************"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <InputField
          label="Confirm Password"
          placeholder="*****************"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <AppButton
          label="Create"
          onPress={createAccount}
          variant="filled"
          loading={loading}
          style={styles.createButton}
        />
      </KeyboardAwareScrollView>

      <Modal animationType="fade" transparent visible={accModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalSuccess}>Successfully Created.</Text>
            <Text style={styles.modalMessage}>
              Check your email for the verification process.
            </Text>
            <AppButton
              label="Okay"
              onPress={() => {
                setAccModal(false);
                navigation.goBack();
              }}
              variant="filled"
              style={styles.modalButton}
              loading={loading}
            />
          </View>
        </View>
      </Modal>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
