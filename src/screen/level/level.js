import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./style";

export default function Level({navigation}) {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.main_text}>
        Choose Level
      </Text>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text}>
          <Text style={styles.level}>Easy</Text>
          <Text style={{color: '#80FFDB'}}>Contains 10 questions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text}>
          <Text style={styles.level}>Medium</Text>
          <Text style={{color: '#80FFDB'}}>Contains 15 questions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text}>
          <Text style={styles.level}>Hard</Text>
          <Text style={{color: '#80FFDB'}}>Contains 20 questions</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.back_btn_container}>
          <Text style={styles.back_btn}>
          Go Back
          </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  )
}