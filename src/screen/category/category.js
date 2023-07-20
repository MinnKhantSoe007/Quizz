import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from "react-native";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';

export default function Category({ navigation }) {

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Technology',
      body: 'Questions about modern technology'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Culture',
      body: 'Questions about different cultures'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'History',
      body: 'Questions about world wide history'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      title: 'History',
      body: 'Questions about world wide history'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d74',
      title: 'History',
      body: 'Questions about world wide history'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d75',
      title: 'History',
      body: 'Questions about world wide history'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d76',
      title: 'History',
      body: 'Questions about world wide history'
    },
  ];

  const renderCategoryItems = ({ item }) => {
    return (
      <View style={styles.level_container}>
        <TouchableOpacity onPress={() => navigation.navigate("Level")}>
          <Text style={styles.level}>{item.title}</Text>
          <Text style={{ color: '#80FFDB', fontFamily: 'RobotoRegular' }}>{item.body}</Text>
        </TouchableOpacity>
      </View>
    )

  }

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="ios-chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Level")} />
      <Text style={styles.main_text}>
        Choose Category
      </Text>
      <View style={styles.flatList}>
        <FlatList
          data={DATA}
          renderItem={renderCategoryItems}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  )
}