import NavigationStack from './src/navigation/navigation';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { Font } from './src/resource/fonts';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Music } from './src/resource/music';

export default function App() {

    const [isFontLoaded] = useFonts(Font);
    const soundPlayer = useAudioPlayer(Music.music.music);
    const soundStatus = useAudioPlayerStatus(soundPlayer);

    if (!isFontLoaded) {
        return null
    };

    if (!soundStatus.isLoaded) {
        return null
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <NavigationStack />
        </>
    );
}

