import { SafeAreaView, Text, View, TouchableOpacity } from "react-native"

export default function Quiz({navigation}) {
  return (
    <SafeAreaView>
 <Text>
      hi
    </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>
          Go Home
        </Text>
    </TouchableOpacity>
    </SafeAreaView>
   
  )
}