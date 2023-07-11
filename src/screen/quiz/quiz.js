import { StatusBar } from "expo-status-bar"
import { SafeAreaView, Text, View, TouchableOpacity, FlatList } from "react-native"
import { styles } from "./style"
import { Ionicons } from '@expo/vector-icons';

export default function Quiz({ navigation }) {

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      answer: 'A. 2',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      answer: 'B. 3',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      answer: 'C. 4',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      answer: 'D. 5',
    }
  ];

  const renderQuizItems = ({ item }) => {
    return (
      <View style={styles.answer_container}>
      <TouchableOpacity onPress={()=> navigation.navigate("Quiz")}>
          <Text style={styles.answer}>{item.answer}</Text>
          <Text style={{ color: '#80FFDB' }}>{item.body}</Text>
      </TouchableOpacity>
    </View>
    )
   
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.quiz_container}>
      <Text style={styles.number}>
        1 of 20
      </Text>

      <Text style={styles.question}>
        What is the result of 1+1 ?
        </Text>
        
        <View style={styles.flatList}>
      <FlatList
        data={DATA}
        renderItem={renderQuizItems}
        keyExtractor={item => item.id}
      />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Level")} style={styles.continue_btn_container}>
          <Text style={styles.continue_btn}>
            Continue
          </Text>
          <Ionicons name="arrow-forward-circle-outline" size={28} style={styles.continue_arrow } />
        </TouchableOpacity>

       
        
      </View>

      
    </SafeAreaView>

  )
}