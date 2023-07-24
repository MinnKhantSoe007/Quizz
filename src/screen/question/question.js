import { Text, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

export default function Question({navigation}) {

  const handleLogOut = () => {
    try {
      FIREBASE_AUTH.signOut();
      navigation.navigate("Home");
    } catch (error) {
      alert(error);
    }
    
  }
  return (
    <View>
      <TouchableOpacity onPress={handleLogOut}>
        <Text>
          Log out
        </Text>
      </TouchableOpacity>
    </View>
  )
}