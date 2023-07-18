import NavigationStack from './src/navigation/navigation';
import { StatusBar, StyleSheet } from 'react-native';

export default function App() {

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <NavigationStack />
        </>


    );
}
