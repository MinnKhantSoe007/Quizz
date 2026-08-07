import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, doc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { ImageResource } from '../../resource/imageResource';
import AppButton from '../../components/AppButton';
import BackButton from '../../components/BackButton';
import InputField from '../../components/InputField';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../theme/theme';

export default function StudentAuth({ navigation }) {
  const [year, setYear] = useState('1st year');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [years] = useState([
    '1st year',
    '2nd year',
    '3rd year',
    '4th year',
    '5th year',
    '6th year',
  ]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNames = async () => {
      if (!year) return;

      setLoading(true);
      try {
        const playersSnapshot = await getDocs(collection(firestore, 'players'));
        const namesData = [];

        for (const playerDoc of playersSnapshot.docs) {
          const playerId = playerDoc.id;
          const yearsCollectionRef = collection(doc(firestore, 'players', playerId), year);
          const yearsSnapshot = await getDocs(yearsCollectionRef);

          yearsSnapshot.forEach((yearDoc) => {
            const { name, password: playerPassword } = yearDoc.data();
            namesData.push({ playerId, name, password: playerPassword });
          });
        }

        namesData.sort((a, b) => a.name.localeCompare(b.name));
        setNames(namesData);
        setUserName(namesData[0]?.name ?? '');
      } catch (error) {
        console.error('Error fetching names:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, [year]);

  const guestLogin = async () => {
    await AsyncStorage.setItem('studentName', 'guest');
    await AsyncStorage.setItem('studentYear', 'guest');
    navigation.navigate('Category');
  };

  const login = async () => {
    if (password.length === 0 || userName?.length === 0) {
      return Alert.alert('Error', 'Password or Name cannot be empty');
    }

    setLoading(true);
    try {
      const userData = names.find((user) => user.name === userName);
      if (userData && userData.password == password) {
        await AsyncStorage.setItem('studentYear', year);
        await AsyncStorage.setItem('studentName', userName);
        Alert.alert('Success', 'Login Successful');
        navigation.navigate('Category');
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

  const renderNamePicker = () => {
    if (
      names.length === 0 ||
      names.some((item) => item.name === undefined || item.password === undefined)
    ) {
      return <Text style={styles.noText}>There is no player here.</Text>;
    }

    return (
      <View style={styles.pickerWrapper}>
        <Text style={styles.fieldLabel}>Player Name</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userName}
            onValueChange={(itemValue) => setUserName(itemValue)}
            style={styles.picker}
            enabled={!!year}
            dropdownIconColor={Colors.textPrimary}
          >
            {names.map((item) => (
              <Picker.Item key={item.playerId} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton disabled={loading} fallbackRoute="Home" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <Image
            source={ImageResource.logo.icon_logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Log In to player account</Text>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.fieldLabel}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={(itemValue) => setYear(itemValue)}
                style={styles.picker}
                dropdownIconColor={Colors.textPrimary}
              >
                {years.map((yearOption) => (
                  <Picker.Item key={yearOption} label={yearOption} value={yearOption} />
                ))}
              </Picker>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator animating size="large" color={Colors.primary} style={styles.loader} />
          ) : (
            <>
              {renderNamePicker()}

              <InputField
                label="Password"
                placeholder="*****************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('UpdateStudentAccount')}
                style={styles.forgotLink}
              >
                <Text style={styles.forgotText}>Forget Password</Text>
              </TouchableOpacity>

              <AppButton label="Log In" onPress={login} variant="filled" style={styles.actionButton} />
            </>
          )}
        </KeyboardAvoidingView>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or don't have account?</Text>
          <View style={styles.dividerLine} />
        </View>

        <AppButton
          label="Play as a Guest"
          onPress={guestLogin}
          variant="outline"
          style={styles.actionButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  logo: {
    width: 80,
    height: 80,
  },

  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  fieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  pickerWrapper: {
    marginBottom: Spacing.md,
  },

  pickerContainer: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },

  picker: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: Platform.OS === 'ios' ? 180 : 52,
  },

  forgotLink: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },

  forgotText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.link,
  },

  actionButton: {
    width: '100%',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },

  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.sm,
  },

  loader: {
    marginVertical: Spacing.xl,
  },

  noText: {
    textAlign: 'center',
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
});
