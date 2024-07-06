import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Text, View, KeyboardAvoidingView, Alert } from "react-native";
import { styles } from "./studentAuthStyle";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

export default function StudentAuth({ navigation }) {
    const [year, setYear] = useState('1st year');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [years, setYears] = useState(["1st year", "2nd year", "3rd year", "4th year", "5th year", "6th year"]);
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        const fetchNames = async () => {
            if (year) {
                setLoading(true);
                try {
                    const playersSnapshot = await getDocs(collection(firestore, 'players'));
                    const namesData = [];

                    for (const playerDoc of playersSnapshot.docs) {
                        const playerId = playerDoc.id;
                        const yearsCollectionRef = collection(doc(firestore, 'players', playerId), year);
                        const yearsSnapshot = await getDocs(yearsCollectionRef);

                        yearsSnapshot.forEach((yearDoc) => {
                            const { name, password } = yearDoc.data();
                            namesData.push({ playerId, name, password });
                        });
                    };
                    namesData.sort((a, b) => a.name.localeCompare(b.name));
                    setNames(namesData);
                    setUserName(namesData[0].name)
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching names:', error);
                    setLoading(false);
                }
            }
        };

        fetchNames();
    }, [year]);

    const guestLogin = async () => {
        await AsyncStorage.clear();
        navigation.navigate("Category")
    }

    const login = async () => {
        if (password.length === 0 || userName?.length === 0) {
            return Alert.alert('Error', 'Password or Name cannot be empty');
        }

        setLoading(true);
        try {
            const userData = names.find(user => user.name === userName);
            console.log("UserData::", userData);
            if (userData && userData.password == password) {
                await AsyncStorage.setItem('studentYear', year);
                await AsyncStorage.setItem('studentName', userName);
                Alert.alert('Success', 'Login Successful');
                navigation.navigate("Category");
            } else {
                Alert.alert('Error', 'Username or Password is incorrect');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOnChangePassword = text => {
        setPassword(text);
    };

    const renderNamePicker = () => {
        if (names.length === 0 || names.some(item => item.name === undefined || item.password === undefined)) {
            return (
                <View>
                    <Text style={styles.noText}>There is no player here.</Text>
                </View>
            );
        } else {
            return (
                <Picker selectedValue={userName} onValueChange={(itemValue) => setUserName(itemValue)} style={styles.picker} enabled={!!year}>
                    {names.map((item) => (
                        <Picker.Item key={item.playerId} label={item.name} value={item.name} />
                    ))}
                </Picker>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("Home")} />

            <Text style={styles.auth_text}>Log in to player account</Text>
            <ScrollView>

            <KeyboardAvoidingView behavior="padding">
                <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
                    {years.map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                    ))}
                </Picker>
            </KeyboardAvoidingView>

            {loading ? <ActivityIndicator animating={true} size="large" color="black" /> :
                <>
                    {renderNamePicker()}

                    <TextInput style={styles.create_input} secureTextEntry={true} placeholder="password" onChangeText={handleOnChangePassword} autoCapitalize="none" autoComplete="password" keyboardType='numeric'/>

                    <View>
                        <TouchableRipple style={styles.login_button} onPress={login}><Text style={styles.login_button_text}>Login</Text></TouchableRipple>
                        <TouchableRipple style={styles.login_button} onPress={() => navigation.navigate("UpdateStudentAccount")}><Text style={styles.login_button_text}>Change Password</Text></TouchableRipple>
                    </View>
                </>
            }
            <TouchableRipple style={styles.guest_button} onPress={guestLogin}><Text style={styles.login_button_text}>Use as Guest</Text></TouchableRipple>
            </ScrollView>
        </SafeAreaView>
    );
}
