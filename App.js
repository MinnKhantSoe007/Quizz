import NavigationStack from './src/navigation/navigation';
import { StatusBar, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Font } from './src/resource/fonts';

export default function App() {

    const [isFontLoaded] = useFonts(Font);

    if (!isFontLoaded) {
        return null
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <NavigationStack />
        </>


    );
}

