import NavigationStack from './src/navigation/navigation';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { Font } from './src/resource/fonts';
import { Audio } from "expo-av";
import { Music } from './src/resource/music';
import { useState } from 'react';

export default function App() {

    const [isFontLoaded] = useFonts(Font);
    const [isSoundReady, setIsSoundReady] = useState(false);

    const loadSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(Music.music.music);
            setIsSoundReady(true);
        } catch (error) {
            console.error('Error while loading sound::', error);
        }
    };

    loadSound();

    if (!isFontLoaded) {
        return null
    };

    if (!isSoundReady) {
        return null
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <NavigationStack />
        </>
    );
}

