import { Image, View } from "react-native";
import { SafeAreaView } from "react-native";
import { styles } from "./style";
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";

export default function Splash({navigation}) {

  useEffect(() => {
    navigation.navigate("Home");
  },[])
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.img_container}>
      <Image source={require('../splash/img/Q.png')} style={styles.img} />
      </View>

      <ActivityIndicator size={60} color='#6930c3' style={styles.activity } />


      
    </SafeAreaView>
  )
}