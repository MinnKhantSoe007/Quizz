import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { ImageResource } from '../../resource/imageResource';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { fetchAllPlayers } from '../../utils/fetchAllPlayers';
import { styles } from './studentAuthStyle';

export default function StudentAuth({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const guestLogin = async () => {
    await AsyncStorage.setItem('studentName', 'guest');
    await AsyncStorage.setItem('studentYear', 'guest');
    navigation.navigate('Category');
  };

  const login = async () => {
    if (!name.trim() || !password) {
      return showToast('Name or Password cannot be empty');
    }

    const match = players.find(
      (player) =>
        player.name?.trim().toLowerCase() === name.trim().toLowerCase() &&
        player.password == password
    );

    if (!match) {
      return showToast('Name or Password is incorrect');
    }

    await AsyncStorage.setItem('studentYear', match.year);
    await AsyncStorage.setItem('studentName', match.name);
    navigation.navigate('Category');
  };

  return (
    <SafeAreaView style={styles.container}>
        <BackButton disabled={loading} fallbackRoute="Home" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <Image
            source={ImageResource.logo.icon_logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Log In to player account</Text>

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
                label="Password"
                placeholder="*****************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('UpdateStudentAccount')}
                style={styles.forgotLink}
              >
                <Text style={styles.forgotText}>Forget Password</Text>
              </TouchableOpacity>

              <AppButton label="Log In" onPress={login} variant="filled" style={styles.actionButton} loading={loading} />
            </>
          )}
        </KeyboardAvoidingView>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or don't have account?</Text>
          <View style={styles.dividerLine} />
        </View>

        <AppButton
          label="Play as a Guest"
          onPress={guestLogin}
          variant="outline"
          style={styles.actionButton}
          disabled={loading}
        />
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}

