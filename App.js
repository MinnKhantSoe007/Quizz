import { StatusBar } from 'expo-status-bar';
import NavigationStack from './src/navigation/navigation';
import { StyleSheet } from 'react-native';

export default function App() {

    return (
            
        <NavigationStack >
            <StatusBar backgroundColor="black"/>
            </NavigationStack>
        
        
    );
}
