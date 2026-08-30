import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, FIREBASE_AUTH } from '../../../firebaseConfig';
import { ImageResource } from '../../resource/imageResource';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Colors, FontFamily, FontSize, Spacing } from '../../theme/theme';
import { DIMENSIONS } from '../../utils/constant';
import { styles } from './authStyle';

export default function Auth({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureCode, setSecureCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toastMessage, showToast } = useToast();

  const login = async () => {
    if (secureCode == 999999 && !!email && !!password) {
      setLoading(true);

      try {
        const response = await signInWithEmailAndPassword(auth, email, password);

        if (response.user.emailVerified) {
          navigation.navigate('Question');
        } else {
          setLoading(false);
          showToast('Please verify your email address before logging in.');
        }
      } catch (error) {
        console.log(error);
        showToast(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      showToast('Please enter all fields correctly.');
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

        <Text style={styles.title}>Log in to quizzer account</Text>

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

          <InputField
            label="Secure Code"
            placeholder="Enter secure code"
            value={secureCode}
            onChangeText={setSecureCode}
            secureTextEntry
            autoCapitalize="none"
          />

          <AppButton label="Log In" onPress={login} variant="filled" loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or don't have account?</Text>
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            label="Create Account"
            onPress={() => navigation.navigate('CreateAccount')}
            variant="outline"
            disabled={loading}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
