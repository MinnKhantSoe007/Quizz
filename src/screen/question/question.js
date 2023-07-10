import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";

export default function Question({navigation}) {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={()=> navigation.navigate("Home")}>
        <Text>
          This is Question screen
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}