import React, { useState } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { FIREBASE_AUTH as auth } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { styles } from './updateStudentAccountStyle';

export default function UpdateStudentAccount({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toastMessage, showToast } = useToast();

  const updateAccount = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return showToast('Fields cannot be empty');
    }
    if (newPassword !== confirmNewPassword) {
      return showToast('New passwords do not match');
    }

    setUpdating(true);
    try {
      const user = auth.currentUser;
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      showToast(
        error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password'
          ? 'Current password is incorrect'
          : error.message
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={updating} onPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Reset your password</Text>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

              <InputField
                label="Confirm New Password"
                placeholder="*****************"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
              />

              <AppButton
                label="Confirm"
                onPress={updateAccount}
                variant="filled"
                loading={updating}
                style={styles.actionButton}
              />
        </KeyboardAvoidingView>
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
