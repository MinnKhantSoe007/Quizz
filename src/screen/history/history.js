import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, ScrollView, KeyboardAvoidingView, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { collection, getDocs, doc } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import { Dimensions } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { styles } from './style';

export default function History({ navigation, route }) {

  const screenWidth = Dimensions.get("window").width;
  const { studentName, studentYear, category, filteredCategories } = route?.params;
  const [categoryTitle, setCategoryTitle] = useState(category?.title);
  const [levels, setLevels] = useState(studentName != "guest" ? filteredCategories.map(item => item.level) : filteredCategories);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [averagePercent, setAveragePercent] = useState(0);
  const [years, setYears] = useState(["1st year", "2nd year", "3rd year", "4th year", "5th year", "6th year"]);
  const [year, setYear] = useState('1st year');
  const [names, setNames] = useState([])
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      if (year && studentName === "guest") {
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

  useEffect(() => {
    fetchHistory();
  }, [category?.id, selectedLevel, userName, year]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'history'));
      const historyData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const filteredData = historyData.filter((item) => {
        const nameToFilter = studentName === "guest" ? userName : studentName;
        const yearToFilter = studentName === "guest" ? year : studentYear;
      
        return (
          item.studentName === nameToFilter &&
          item.studentYear === yearToFilter &&
          item.categoryName === categoryTitle &&
          item.difficultyLevel === selectedLevel
        );
      });
      

      setHistory(filteredData);

      if (filteredData.length > 0) {
        const totalPercent = filteredData.reduce((acc, item) => acc + item.percent, 0);
        const avgPercent = totalPercent / filteredData.length;
        setAveragePercent(avgPercent.toFixed(2)); // To show up to two decimal places
      } else {
        setAveragePercent(0);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const renderNamePicker = () => {
    if (names.length === 0 || names.some(item => item.name === undefined || item.password === undefined)) {
      return (
        <View>
          <Text style={styles.level}>There is no player here.</Text>
        </View>
      );
    } else {
      return (
        <>
          <Text style={styles.level}>Choose Player:</Text>
          <Picker selectedValue={userName} onValueChange={(itemValue) => setUserName(itemValue)} style={styles.picker} enabled={!!year}>
            {names.map((item) => (
              <Picker.Item key={item.playerId} label={item.name} value={item.name} />
            ))}
          </Picker>
        </>
      );
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#5E60CE",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#5E60CE",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const chartData = {
    labels: history.map(item => item.date.split(',')[0]),
    datasets: [
      {
        data: history.map(item => item.percent),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Ionicons name="chevron-back-outline" size={30} style={styles.back} onPress={() => navigation.goBack()} />

        <Text style={styles.main_text}>
          History For {category?.title}
        </Text>

        {studentName === "guest" && 
        <>
        <Text style={styles.level}>
          Choose Year:
        </Text>

        <KeyboardAvoidingView behavior="padding">
          <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>

          {renderNamePicker()}
          </KeyboardAvoidingView>
        </>}

            {/* { (userName && year && studentName === "guest") || (studentName != "guest") &&
            <> 
             <Text style={styles.level}>
          Choose Level:
        </Text>

        <Picker
          selectedValue={selectedLevel}
          onValueChange={(itemValue) => setSelectedLevel(itemValue)}
          style={styles.picker}
        >
          {levels.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
         </>
} */}

{studentName === "guest" ? userName && year && <> 
             <Text style={styles.level}>
          Choose Level:
        </Text>

        <Picker
          selectedValue={selectedLevel}
          onValueChange={(itemValue) => setSelectedLevel(itemValue)}
          style={styles.picker}
        >
          {levels.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
         </> : <> 
             <Text style={styles.level}>
          Choose Level:
        </Text>

        <Picker
          selectedValue={selectedLevel}
          onValueChange={(itemValue) => setSelectedLevel(itemValue)}
          style={styles.picker}
        >
          {levels.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
         </>}
        {loading ? (
          <ActivityIndicator animating={true} size="large" color="black" />
        ) : history.length === 0 ? (
          <Text style={styles.no_data_text}>There is no data</Text>
        ) : (
          // (year && userName && selectedLevel && studentName === "guest") || studentName != "guest" &&
          studentName === "guest" ? 
          year && userName &&
            <>
            <Text style={styles.level}>
              Overall Percentage: {averagePercent}%
            </Text>
            <ScrollView horizontal={true}>
              <LineChart
                data={chartData}
                width={history.length == 1 ? screenWidth * history.length : screenWidth * history.length * 0.5}
                height={320}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </ScrollView>
          </>
          :
          <>
          <Text style={styles.level}>
            Overall Percentage: {averagePercent}%
          </Text>
          <ScrollView horizontal={true}>
            <LineChart
              data={chartData}
              width={history.length == 1 ? screenWidth * history.length : screenWidth * history.length * 0.5}
              height={320}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          </ScrollView>
        </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
