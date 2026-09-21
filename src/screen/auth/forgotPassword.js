import React, { useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import AppButton from "../../components/AppButton";
import BackButton from "../../components/BackButton";
import InputField from "../../components/InputField";
import Toast from "../../components/Toast";
import { ImageResource } from "../../resource/imageResource";
import { useToast } from "../../hooks/useToast";
import { styles } from "../updateAccount/updateStudentAccountStyle";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toastMessage, showToast } = useToast();

  const sendReset = async () => {
    if (!email.trim()) return showToast("Please enter your email.");

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast("Reset link sent. Check your email.");
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showToast(
        error.code === "auth/user-not-found"
          ? "No account with that email."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton disabled={loading} fallbackRoute="StudentAuth" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <Image source={ImageResource.logo.icon_logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Forgot your password?</Text>
        <InputField
          label="Email"
          placeholder="Contact@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <AppButton
          label="Send Reset Link"
          onPress={sendReset}
          variant="filled"
          loading={loading}
          style={styles.actionButton}
        />
      </ScrollView>
      <Toast message={toastMessage} />
    </SafeAreaView>
  );
}
