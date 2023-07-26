import { SafeAreaView, TextInput, TouchableOpacity, Text, View, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore"
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";

export default function CreateAccount({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [accModal, setAccModal] = useState(false);
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

  const renderModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={accModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <Text style={styles.success}>
                Successfully Created.
              </Text>

              <Text style={styles.check}>
                Check your email for the verification process.
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
                <Text style={styles.ok}>
                  Okay
                </Text>

              </TouchableOpacity>
            </View>
          </View>

        </Modal>
      </View>
    )
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

      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, {
        name: name,
        email: email,
      });

      await sendEmailVerification(user);

      setAccModal(true);

    } catch (error) {
      console.log(error);
      alert(error.message);
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

      {renderModal()}


    </SafeAreaView>
  )
}
