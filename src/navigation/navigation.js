import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screen/home/home";
import Quiz from "../screen/quiz";
import Splash from "../screen/splash/splash";

const Stack = createStackNavigator();

export default function NavigationStack() {

  return (

    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
        headerShown: false
      }}>

        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Quiz" component={Quiz} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}