import { Image, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { styles } from "./style";
import { useEffect } from "react";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import { ImageResource } from "../../resource/imageResource";
import { forgetRole, recallRole } from "../../utils/session";
import { hasRole } from "../../utils/roles";
import { authenticateDevice } from "../../utils/localAuth";

// Firebase restores its persisted session asynchronously; the first callback is the restored user (or null).
const restoredUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

export default function Splash({ navigation }) {

  useEffect(() => {
    const enter = async () => {
      const [role, user] = await Promise.all([recallRole(), restoredUser()]);
      if (!user || !role) return "Home";

      if (!(await hasRole(user.uid, role))) {
        await forgetRole();
        return "Home";
      }
      if (!(await authenticateDevice("Unlock to continue"))) return "Home";

      if (role === "player") {
        await AsyncStorage.setItem("studentName", user.displayName || "Player");
        await AsyncStorage.setItem("studentUid", user.uid);
        return "Category";
      }
      return "Question";
    };

    // Any failure (offline, cancelled prompt) falls back to Home; the stored session stays for next launch.
    enter()
      .catch(() => "Home")
      .then((screen) =>
        navigation.reset({
          index: screen === "Home" ? 0 : 1,
          routes: screen === "Home" ? [{ name: "Home" }] : [{ name: "Home" }, { name: screen }],
        })
      );
  }, [])

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.img_container}>
        <Image source={ImageResource.logo.splash_logo} style={styles.img} />
      </View>

      <ActivityIndicator size={60} color='#6930c3' style={styles.activity} />

    </SafeAreaView>
  )
}
