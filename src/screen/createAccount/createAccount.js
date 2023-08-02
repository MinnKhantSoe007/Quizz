import { SafeAreaView, TextInput, TouchableOpacity, Text, View, Modal, Image } from "react-native";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore"
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { TouchableRipple } from "react-native-paper"

export default function CreateAccount({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState("");
  const [accModal, setAccModal] = useState(false);

  const handleOnChangeName = text => {
    setName(text);
  };

  const handleOnChangeEmail = text => {
    setEmail(text);
  };

  const handleOnChangePassword = text => {
    setPassword(text);
  };

  const handleSelectProfilePicture = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      setSelectedProfilePicture(result.assets[0].uri);
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

      <TouchableRipple style={styles.photoButton} onPress={handleSelectProfilePicture}><Text style={styles.photoButtonText}>Select Picture</Text></TouchableRipple>

      <TextInput style={styles.create_input} placeholder="Name" onChangeText={handleOnChangeName} />

      <TextInput style={styles.create_input} placeholder="Email" onChangeText={handleOnChangeEmail} />

      <TextInput style={styles.create_input} secureTextEntry={true} placeholder="Password" onChangeText={handleOnChangePassword} />

      {selectedProfilePicture ? <Image source={{ uri: selectedProfilePicture }} style={styles.selectedPic} /> : null}

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
          <TouchableRipple style={styles.login_button} onPress={createAccount}><Text style={styles.login_button_text}>Create account</Text></TouchableRipple>
        </View>
      }

      {renderModal()}
      
    </SafeAreaView>
  )
}
