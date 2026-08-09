import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { fetchAllPlayers } from '../../utils/fetchAllPlayers';
import { styles } from './updateStudentAccountStyle';

export default function UpdateStudentAccount({ navigation }) {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        setPlayers(await fetchAllPlayers(firestore));
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const updateAccount = async () => {
    if (!name.trim() || !currentPassword || !newPassword || !confirmNewPassword) {
      return showToast('Fields cannot be empty');
    }

    if (newPassword !== confirmNewPassword) {
      return showToast('New passwords do not match');
    }

    const match = players.find(
      (player) =>
        player.name?.trim().toLowerCase() === name.trim().toLowerCase() &&
        player.password == currentPassword
    );

    if (!match) {
      return showToast('Name or Current Password is incorrect');
    }

    setUpdating(true);
    try {
      const playerDocRef = doc(firestore, 'players', match.playerId, match.year, match.id);
      await updateDoc(playerDocRef, { password: newPassword });
      await AsyncStorage.setItem('studentName', 'guest');
      await AsyncStorage.setItem('studentYear', 'guest');
      Alert.alert('Success', 'Update Successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating account:', error);
      showToast('Update Failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={loading || updating} onPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Update your account</Text>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {loading ? (
            <Loader style={styles.loader} />
          ) : players.length === 0 ? (
            <Text style={styles.noText}>There is no player here.</Text>
          ) : (
            <>
              <InputField
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <InputField
                label="Current Password"
                placeholder="*****************"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                keyboardType="numeric"
              />

              <InputField
                label="New Password"
                placeholder="*****************"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                keyboardType="numeric"
              />

              <InputField
                label="Confirm New Password"
                placeholder="*****************"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
                autoCapitalize="none"
                keyboardType="numeric"
              />

              <AppButton
                label="Confirm"
                onPress={updateAccount}
                variant="filled"
                loading={updating}
                style={styles.actionButton}
              />
            </>
          )}
        </KeyboardAvoidingView>
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
