import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import { styles } from "./style";

export default function Question({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={()=> navigation.navigate("Home")}>
        <Text>
          This is Question screen
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}