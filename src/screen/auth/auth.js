import { SafeAreaView, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function Auth({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleOnChangeEmail = text => {
    setEmail(text);
    console.log("email", text)
  };

  const handleOnChangePassword = text => {
    setPassword(text);
    console.log("password", text)
  };

  const login = () => {
    email == "mks@gmail.com" && password == "mks11111" ? navigation.navigate("Question") :
    Alert.alert('Error', 'Check the information you have filled again.', [
      { text: 'OK' }
    ]);
  }


  return (
    <SafeAreaView style={styles.container}>
      
      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />
      
      <Text style={styles.auth_text}>Authentication</Text>

      <TextInput style={styles.create_input} placeholder="email" onChangeText={handleOnChangeEmail} />

      <TextInput style={styles.create_input} secureTextEntry={true} placeholder="password" onChangeText={handleOnChangePassword} />

      <TouchableOpacity style={styles.login_button} onPress={login}><Text style={styles.login_button_text}>Login</Text></TouchableOpacity>

    </SafeAreaView>
  )
}
