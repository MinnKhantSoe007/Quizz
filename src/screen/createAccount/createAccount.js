import { SafeAreaView, TextInput, TouchableOpacity, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

export default function CreateAccount({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const auth = FIREBASE_AUTH;

  const handleOnChangeName = text => {
    setName(text);
    console.log("name", text)
  };

  const handleOnChangeEmail = text => {
    setEmail(text);
    console.log("email", text)
  };

  const handleOnChangePassword = text => {
    setPassword(text);
    console.log("password", text)
  };

  const handleSelectProfilePicture = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const createAccount = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;

      await updateProfile(user, {
        displayName: name,
        photoURL: profilePicture
      });

      await sendEmailVerification(user);

      alert("Successfully Created");
      navigation.navigate("Auth");

    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
       
      
      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Auth")} />
      
      <Text style={styles.auth_text}>Create Account</Text>

      <TextInput style={styles.create_input} placeholder="Name" onChangeText={handleOnChangeName} />

      <TextInput style={styles.create_input} placeholder="Email" onChangeText={handleOnChangeEmail} />

      <TextInput style={styles.create_input} secureTextEntry={true} placeholder="Password" onChangeText={handleOnChangePassword} />

      <TouchableOpacity style={styles.login_button} onPress={handleSelectProfilePicture}><Text style={styles.login_button_text}>Select Picture</Text></TouchableOpacity>

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
        <TouchableOpacity style={styles.login_button} onPress={createAccount}><Text style={styles.login_button_text}>Create account</Text></TouchableOpacity>
        </View>
       
      }
      
      
    </SafeAreaView>
  )
}
