import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { DATA } from '../../data/quizData';

export default function Category({ navigation }) {

  const allQuestions = DATA;

  const handleCategory = (categoryTitle) => {
    console.log(categoryTitle);
    navigation.navigate("Level", {categoryTitle})
  }

  const renderCategoryItems = ({ item }) => {
    return (
      <View style={styles.level_container}>
        <TouchableOpacity onPress={() => handleCategory(item.title)}>
          <Text style={styles.level}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )

  }

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />
      <Text style={styles.main_text}>
        Choose Category
      </Text>
      <View style={styles.flatList}>
        <FlatList
          data={allQuestions}
          renderItem={renderCategoryItems}
          keyExtractor={item => item.title}
        />
      </View>
    </SafeAreaView>
  )
}