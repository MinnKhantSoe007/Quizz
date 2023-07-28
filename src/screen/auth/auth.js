import { SafeAreaView, TextInput, TouchableOpacity, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Auth({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleOnChangeEmail = text => {
    setEmail(text);
    console.log("email", text)
  };

  const handleOnChangePassword = text => {
    setPassword(text);
    console.log("password", text)
  };

  const login = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Response::", response);
      setEmail("");
      setPassword("");
      navigation.navigate("Question");
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
      
      <Text style={styles.auth_text}>Authentication</Text>

      <TextInput style={styles.create_input} placeholder="email" onChangeText={handleOnChangeEmail} />

      <TextInput style={styles.create_input} secureTextEntry={true} placeholder="password" onChangeText={handleOnChangePassword} />

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
           <TouchableOpacity style={styles.login_button} onPress={login}><Text style={styles.login_button_text}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={styles.login_button} onPress={()=> navigation.navigate("CreateAccount")}><Text style={styles.login_button_text}>Create account</Text></TouchableOpacity>
        </View>
       
      }
      

    </SafeAreaView>
  )
}
