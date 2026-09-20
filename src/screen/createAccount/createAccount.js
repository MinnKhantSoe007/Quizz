import React, { useState } from 'react';
import { Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
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
import { grantRole, hasRole, isWrongCode, verifyQuizzerCode } from '../../utils/roles';
import { styles } from './style';

export default function CreateAccount({ navigation, route }) {
  const isPlayer = route.params?.role === 'player';
  const role = isPlayer ? 'player' : 'quizzer';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [secureCode, setSecureCode] = useState('');
  const [accModal, setAccModal] = useState(false);
  const { uri: profilePicture, pickImage } = useImagePicker();
  const { toastMessage, showToast } = useToast();

  const createAccount = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || (!isPlayer && !secureCode)) {
      showToast('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (!isPlayer && !(await verifyQuizzerCode(secureCode))) {
        showToast('Incorrect secure code.');
        return;
      }

      let user;
      try {
        user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      } catch (error) {
        if (error.code !== 'auth/email-already-in-use') throw error;
        // Same email, other role: prove ownership with the existing password, then add this role.
        try {
          user = (await signInWithEmailAndPassword(auth, email, password)).user;
        } catch (signInError) {
          const wrongPassword = ['auth/invalid-credential', 'auth/wrong-password'].includes(signInError.code);
          showToast(
            wrongPassword
              ? 'This email already has an account, and that password is wrong. Use its existing password (or reset it from the login screen).'
              : `${signInError.code || signInError.message}`
          );
          return;
        }
        if (await hasRole(user.uid, role)) {
          await signOut(auth);
          showToast(`You already have a ${role} account. Please log in.`);
          return;
        }
      }

      let photoURL = user.photoURL || '';
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

      await grantRole(user.uid, role, secureCode.trim());
      if (isPlayer) {
        await setDoc(doc(firestore, 'players', user.uid), { name, email, photoURL });
      } else {
        await addDoc(collection(firestore, 'users'), { name, email, creatorUid: user.uid, photoURL });
      }

      if (!user.emailVerified) await sendEmailVerification(user);
      await signOut(auth);
      setAccModal(true);
    } catch (error) {
      // The auth user may exist without a role; retrying with the same email resumes from here.
      await signOut(auth).catch(() => {});
      showToast(isWrongCode(error) ? 'Incorrect secure code.' : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={loading} fallbackRoute={isPlayer ? 'StudentAuth' : 'Auth'} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <AvatarPicker uri={profilePicture} onPress={pickImage} disabled={loading} />
          <Text style={styles.title}>Create {isPlayer ? 'Player' : 'Quizzer'} Account</Text>
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

        {!isPlayer && (
          <InputField
            label="Secure Code"
            placeholder="Enter secure code"
            value={secureCode}
            onChangeText={setSecureCode}
            secureTextEntry
            autoCapitalize="none"
          />
        )}

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
