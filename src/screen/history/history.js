import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_FIRESTORE as firestore } from '../../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import BackButton from '../../components/BackButton';
import Loader from '../../components/Loader';
import { fetchAllPlayers } from '../../utils/fetchAllPlayers';
import { Colors } from '../../theme/theme';
import { styles } from './style';

export default function History({ navigation, route }) {

  const screenWidth = Dimensions.get("window").width;
  const { studentName, studentYear, category, filteredCategories } = route?.params;
  const isGuest = studentName === "guest";
  const [levels] = useState(isGuest ? filteredCategories : filteredCategories.map(item => item.level));
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [averagePercent, setAveragePercent] = useState(0);

  useEffect(() => {
    if (!isGuest) return;

    const loadPlayers = async () => {
      setLoading(true);
      try {
        const allPlayers = await fetchAllPlayers(firestore);
        setPlayers(allPlayers);
        if (allPlayers.length > 0) setSelectedPlayer(allPlayers[0]);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [isGuest]);

  useEffect(() => {
    if (isGuest && !selectedPlayer) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'history'));
        const historyData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const nameToFilter = isGuest ? selectedPlayer.name : studentName;
        const yearToFilter = isGuest ? selectedPlayer.year : studentYear;

        const filteredData = historyData.filter((item) =>
          item.studentName === nameToFilter &&
          item.studentYear === yearToFilter &&
          item.categoryName === category?.title &&
          item.difficultyLevel === selectedLevel
        );

        setHistory(filteredData);

        if (filteredData.length > 0) {
          const totalPercent = filteredData.reduce((acc, item) => acc + item.percent, 0);
          setAveragePercent((totalPercent / filteredData.length).toFixed(2));
        } else {
          setAveragePercent(0);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [category?.id, selectedLevel, selectedPlayer, isGuest, studentName, studentYear]);

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(127, 17, 224, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const chartData = {
    labels: history.map(item => item.date.split(',')[0]),
    datasets: [
      {
        data: history.map(item => item.percent),
        color: (opacity = 1) => `rgba(127, 17, 224, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton style={{ paddingHorizontal: 0 }} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          History for {category?.title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isGuest && (
          players.length === 0 && !loading ? (
            <Text style={styles.emptyText}>There is no player here.</Text>
          ) : (
            <View style={styles.selectWrapper}>
              <Picker
                selectedValue={selectedPlayer?.id}
                onValueChange={(id) => setSelectedPlayer(players.find((p) => p.id === id))}
                style={styles.select}
              >
                {players.map((player) => (
                  <Picker.Item key={player.id} label={`${player.name} (${player.year})`} value={player.id} />
                ))}
              </Picker>
            </View>
          )
        )}

        {(!isGuest || selectedPlayer) && (
          <View style={styles.selectWrapper}>
            <Picker
              selectedValue={selectedLevel}
              onValueChange={setSelectedLevel}
              style={styles.select}
            >
              {levels.map((level) => (
                <Picker.Item key={level} label={level} value={level} />
              ))}
            </Picker>
          </View>
        )}

        {loading ? (
          <Loader style={styles.loader} />
        ) : history.length === 0 ? (
          <Text style={styles.no_data_text}>There is no data</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.overallLabel}>Overall Percentage</Text>
            <Text style={styles.overallPercent}>{averagePercent}%</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={chartData}
                width={history.length === 1 ? screenWidth : screenWidth * history.length * 0.5}
                height={280}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
              />
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
