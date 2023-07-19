import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screen/home/home";
import Splash from "../screen/splash/splash";
// import Quiz from "../screen/quiz/quiz";
import Level from "../screen/level/level";
import Question from "../screen/question/question";
import Category from "../screen/category/category";
import Auth from "../screen/auth/auth";
import QuizTest from "../screen/quizTest/quizTest";

const Stack = createStackNavigator();

export default function NavigationStack() {

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        {/* <Stack.Screen name="Quiz" component={Quiz} /> */}
        <Stack.Screen name="QuizTest" component={QuizTest} />
        <Stack.Screen name="Level" component={Level} />
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Auth" component={Auth} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}