import { View, Text } from "react-native";
import firebase from "../../firebase/firebaseConfig";

const titlesCollection = firebase.firestore().collection("titles");
console.log("Title collection ::", titlesCollection);

export default function createTitle({navigation}) {
  return (
    <View>
      <Text>
        This is create screen.
      </Text>
    </View>
  )
}

