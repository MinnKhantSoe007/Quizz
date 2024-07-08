import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Text, View, KeyboardAvoidingView, Alert } from "react-native";
import { styles } from "./updateStudentAccountStyle";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE as firestore } from "../../../firebaseConfig";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

export default function UpdateStudentAccount({ navigation }) {
    const [year, setYear] = useState('1st year');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
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
                            namesData.push({ playerId, name, password, id: yearDoc.id });
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

    const updateAccount = async () => {
        if (password.length === 0 || userName?.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0) {
            return Alert.alert('Error', 'Fields cannot be empty');
        }

        setLoading(true);
        try {
            const userData = names.find(user => user.name === userName);
            
            if (userData && userData.password == password) {
                if (newPassword === confirmNewPassword) {
                    const playerDocRef = doc(firestore, 'players', userData.playerId, year, userData.id);
                    await updateDoc(playerDocRef, { password: newPassword });
                    await AsyncStorage.setItem("studentName", "guest")
                    await AsyncStorage.setItem("studentYear", "guest")

                    Alert.alert('Success', 'Update Successful');
                    navigation.navigate("StudentAuth");
                } else {
                    Alert.alert('Error', 'New passwords do not match');
                }
            } else {
                Alert.alert('Error', 'Username or Current Password is incorrect');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            Alert.alert('Error', 'Update Failed');
        } finally {
            setLoading(false);
        }
    };




    const handleOnChangePassword = text => {
        setPassword(text);
    };

    const handleOnChangeNewPassword = text => {
        setNewPassword(text);
    };

    const handleOnChangeConfirmNewPassword = text => {
        setConfirmNewPassword(text);
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
            <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.navigate("StudentAuth")} />

            <Text style={styles.auth_text}>Update your account</Text>
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

                        <TextInput style={styles.create_input} secureTextEntry={true} placeholder="Current Password" onChangeText={handleOnChangePassword} autoCapitalize="none" autoComplete="password" keyboardType='numeric' />
                        <TextInput style={styles.create_input} secureTextEntry={true} placeholder="New Password" onChangeText={handleOnChangeNewPassword} autoCapitalize="none" autoComplete="password" keyboardType='numeric' />
                        <TextInput style={styles.create_input} secureTextEntry={true} placeholder="Confirm New Password" onChangeText={handleOnChangeConfirmNewPassword} autoCapitalize="none" autoComplete="password" keyboardType='numeric' />
                        <View>
                            <TouchableRipple style={styles.login_button} onPress={updateAccount}><Text style={styles.login_button_text}>Confirm</Text></TouchableRipple>
                        </View>
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    );
}
