import { View, Text, SafeAreaView, Image } from "react-native"
import { styles } from "./style"
import { ImageResource } from "../../resource/imageResource"
import { TouchableRipple } from "react-native-paper"

export default function Home({ navigation }) {
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

          <TouchableRipple onPress={() => navigation.navigate("Auth")} style={styles.add_btn_container}>
            <Text style={styles.add_btn}>
              Add Quiz
            </Text>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate("Category")} style={styles.start_btn_container}>
            <Text style={styles.start_btn}>
              Let's Brain Storm
            </Text>
          </TouchableRipple>

        </View>
      </SafeAreaView>
    </>


  )
}