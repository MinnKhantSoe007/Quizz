import React, { useState } from 'react';
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
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FIREBASE_AUTH as auth } from '../../../firebaseConfig';
import { hasRole } from '../../utils/roles';
import { ImageResource } from '../../resource/imageResource';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { forgetRole, rememberRole } from '../../utils/session';
import { styles } from './studentAuthStyle';

export default function StudentAuth({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toastMessage, showToast } = useToast();

  const guestLogin = async () => {
    await AsyncStorage.setItem('studentName', 'guest');
    await AsyncStorage.setItem('studentUid', 'guest');
    await forgetRole();
    navigation.navigate('Category');
  };

  const login = async () => {
    if (!email.trim() || !password) {
      return showToast('Email or Password cannot be empty');
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);

      if (!user.emailVerified) {
        await signOut(auth);
        return showToast('Please verify your email address before logging in.');
      }

      if (!(await hasRole(user.uid, 'player'))) {
        await signOut(auth);
        return showToast('This is not a player account.');
      }

      await AsyncStorage.setItem('studentName', user.displayName || 'Player');
      await AsyncStorage.setItem('studentUid', user.uid);
      await rememberRole('player');
      navigation.navigate('Category');
    } catch (error) {
      showToast('Email or Password is incorrect');
    } finally {
      setLoading(false);
    }
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
            autoComplete="password"
            textContentType="password"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <AppButton label="Log In" onPress={login} variant="filled" style={styles.actionButton} loading={loading} />
        </KeyboardAvoidingView>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or don't have account?</Text>
          <View style={styles.dividerLine} />
        </View>

        <AppButton
          label="Create Account"
          onPress={() => navigation.navigate('CreateAccount', { role: 'player' })}
          variant="outline"
          style={[styles.actionButton, { marginBottom: 20 }]}
          disabled={loading}
        />

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
