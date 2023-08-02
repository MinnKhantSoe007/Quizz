import { SafeAreaView, TextInput, Text, View, KeyboardAvoidingView } from "react-native";
import { styles } from "./style";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { TouchableRipple } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  // AsyncStorage
  // .getItem('userToken')
  // .then((token) => {
  //   if (token) {
  //     signInWithCustomToken(auth, token);
  //   }
  // })
  //   .catch((error) => console.log('Error loading user token:', error));

  const handleOnChangeEmail = text => {
    setEmail(text);
  };

  const handleOnChangePassword = text => {
    setPassword(text);
  };

  const login = async () => {

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      if (response.user.emailVerified) {
        navigation.navigate("Question");
      } else {
        setLoading(false);
        alert("Please verify your email address before logging in.");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />

      <Text style={styles.auth_text}>Enter your email and password</Text>

      <KeyboardAvoidingView behavior="padding">

        <TextInput style={styles.create_input} placeholder="email" onChangeText={handleOnChangeEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />

        <TextInput style={styles.create_input} secureTextEntry={true} placeholder="password" onChangeText={handleOnChangePassword} autoCapitalize="none" autoComplete="password" />

      </KeyboardAvoidingView>

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
          <TouchableRipple style={styles.login_button} onPress={login}><Text style={styles.login_button_text}>Login</Text></TouchableRipple>

          <TouchableRipple style={styles.login_button} onPress={() => navigation.navigate("CreateAccount")}><Text style={styles.login_button_text}>Create account</Text></TouchableRipple>
        </View>
      }
    </SafeAreaView>
  )
}
