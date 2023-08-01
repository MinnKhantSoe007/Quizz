import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screen/home/home";
import Splash from "../screen/splash/splash";
import Level from "../screen/level/level";
import Question from "../screen/question/question";
import Category from "../screen/category/category";
import Auth from "../screen/auth/auth";
import QuizTest from "../screen/quizTest/quizTest";
import CreateAccount from "../screen/createAccount/createAccount";
import QuizCategory from "../screen/quizCategory/quizCategory";
import CreateCategory from "../screen/createCategory/createCategory";
import CreateQuiz from "../screen/createQuiz/createQuiz";
import EditQuiz from "../screen/editQuiz.js/editQuiz";
import DetailAccount from "../screen/detailAccount/detailAccount";
import UpdateAccount from "../screen/updateAccount/updateAccount";

const Stack = createStackNavigator();

export default function NavigationStack() {

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="QuizTest" component={QuizTest} />
        <Stack.Screen name="Level" component={Level} />
        <Stack.Screen name="Question" component={Question} />
        <Stack.Screen name="QuizCategory" component={QuizCategory} />
        <Stack.Screen name="CreateCategory" component={CreateCategory} />
        <Stack.Screen name="EditQuiz" component={EditQuiz} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="CreateQuiz" component={CreateQuiz} />
        <Stack.Screen name="DetailAccount" component={DetailAccount} />
        <Stack.Screen name="UpdateAccount" component={UpdateAccount} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}