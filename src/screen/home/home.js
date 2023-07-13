import { TouchableOpacity, View, Text } from "react-native"
import { styles } from "./style"
import { SafeAreaView } from "react-native"
import { Image } from "react-native"
import { ImageResource } from "../../resource/imageResource"

export default function Home({navigation}) {
  return (
    <>
      <SafeAreaView style={styles.container}>

        <View style={styles.image_container}>
        <Image source={ImageResource.logo.home_logo}
          style={styles.image}
          resizeMode="contain"
        />
        </View>

        <View style={styles.title_container}>
          <Text style={styles.title}>
            Create and play quizes whenever and wherever you want
          </Text>
        </View>
       
        <View>

        <TouchableOpacity onPress={() => navigation.navigate("Auth")} style={styles.add_btn_container}>
          <Text style={styles.add_btn}>
          Add Quiz
          </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate("Level")} style={styles.start_btn_container}>
          <Text style={styles.start_btn}>
          Let's Play
          </Text>
          </TouchableOpacity>
          
        </View>
     
       
      </SafeAreaView>
    </>
    
    
  )
}