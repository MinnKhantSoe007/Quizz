import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function Level({navigation}) {
  return (
    <SafeAreaView style={styles.container}>

      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back } onPress={() => navigation.navigate("Home")}/>
      
      <Text style={styles.main_text}>
        Choose Level
      </Text>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Category")}>
          <Text style={styles.level}>Easy</Text>
          <Text style={{color: '#80FFDB', fontFamily: 'RobotoRegular'}}>Contains 10 questions each with 50seconds time limit.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Category")}>
          <Text style={styles.level}>Medium</Text>
          <Text style={{color: '#80FFDB', fontFamily: 'RobotoRegular'}}>Contains 15 questions each with 40seconds time limit.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.level_container}>
        <TouchableOpacity style={styles.level_text} onPress={()=> navigation.navigate("Category")}>
          <Text style={styles.level}>Hard</Text>
          <Text style={{color: '#80FFDB', fontFamily: 'RobotoRegular'}}>Contains 20 questions each with 30seconds time limit.</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  )
}