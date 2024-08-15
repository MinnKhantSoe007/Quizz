import { SafeAreaView, TextInput, TouchableOpacity, Text, View, Modal, Image } from "react-native";
import { styles } from "./style";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH as auth, FIREBASE_STORAGE as storage } from "../../../firebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore"
import { FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { TouchableRipple } from "react-native-paper"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  
      let photoURL = "";
      if (profilePicture) {
        // Generate a unique filename
        const responseUserId = user.uid;
        const imageName = `profilePictures/${responseUserId}.jpg`;
        const response = await fetch(profilePicture);
        const blob = await response.blob();
        const storageRef = ref(storage, imageName);
        const uploadTask = await uploadBytes(storageRef, blob);
        // Get the download URL of the uploaded image
        photoURL = await getDownloadURL(uploadTask.ref);
      }
  
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL
      });
  
      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, {
        name: name,
        email: email,
        creatorUid: user.uid,
        photoURL: photoURL
      });
  
      await sendEmailVerification(user);
  
      setAccModal(true);
  
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  



  return (
    <SafeAreaView style={styles.container}>


      <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Auth")} />

      <Text style={styles.auth_text}>Create Account</Text>

      <View style={styles.photoContainer}>

        <TouchableRipple style={styles.photoButton} onPress={handleSelectProfilePicture}><Text style={styles.photoButtonText}>Select Picture</Text></TouchableRipple>

        {selectedProfilePicture ? <Image source={{ uri: selectedProfilePicture }} style={styles.selectedPic} /> : null}

      </View>

      <TextInput style={styles.create_input} placeholder="Name" onChangeText={handleOnChangeName} />

      <TextInput style={styles.create_input} placeholder="Email" onChangeText={handleOnChangeEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email"/>

      <TextInput style={styles.create_input} secureTextEntry={true} placeholder="Password" onChangeText={handleOnChangePassword} />

      {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
          <TouchableRipple style={styles.login_button} onPress={createAccount}><Text style={styles.login_button_text}>Create account</Text></TouchableRipple>
        </View>
      }

      {renderModal()}

    </SafeAreaView>
  )
}
