import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./style";

export default function Category({navigation}) {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.main_text}>
        Choose Category
      </Text>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Quiz")}>
          <Text style={styles.level}>Technology</Text>
          <Text style={{color: '#80FFDB'}}>Questions about modern technology</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Quiz")}>
          <Text style={styles.level}>Culture</Text>
          <Text style={{color: '#80FFDB'}}>Questions about different cultures</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Quiz")}>
          <Text style={styles.level}>History</Text>
          <Text style={{color: '#80FFDB'}}>Questions about world wide history</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Level")} style={styles.back_btn_container}>
          <Text style={styles.back_btn}>
          Go Back
          </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Question")} style={styles.start_btn_container}>
          <Text style={styles.back_btn}>
          Start
          </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  )
}